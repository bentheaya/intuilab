from .models import ConceptMastery, SRSReview
from datetime import timedelta
from django.utils import timezone

class MasteryService:
    """
    Implements Bayesian Knowledge Tracing (BKT) logic.
    """
    
    @staticmethod
    def update_mastery(user, concept, is_correct, p_slip=0.1, p_guess=0.2):
        """
        Updates the probability of mastery for a user and concept based on an attempt.
        """
        mastery, created = ConceptMastery.objects.get_or_create(
            user=user, 
            concept=concept
        )
        
        p_ln_minus_1 = mastery.p_known
        p_t = mastery.p_transit # Transition probability
        
        if is_correct:
            # P(Ln-1 | Correct)
            p_ln_given_obs = (p_ln_minus_1 * (1 - p_slip)) / (
                (p_ln_minus_1 * (1 - p_slip)) + ((1 - p_ln_minus_1) * p_guess)
            )
        else:
            # P(Ln-1 | Incorrect)
            p_ln_given_obs = (p_ln_minus_1 * p_slip) / (
                (p_ln_minus_1 * p_slip) + ((1 - p_ln_minus_1) * (1 - p_guess))
            )
            
        # P(Ln) = P(Ln-1 | Obs) + (1 - P(Ln-1 | Obs)) * P(T)
        p_ln = p_ln_given_obs + (1 - p_ln_given_obs) * p_t
        
        # Update and save
        mastery.p_known = min(0.999, max(0.001, p_ln))
        mastery.save()
        return mastery

class SRSService:
    """
    Implements the SM-2 algorithm for Spaced Repetition.
    """
    
    @staticmethod
    def record_review(user, flashcard, quality):
        """
        Calculates the next interval using Modified SM-2.
        Quality (q): 0-5
        0: Complete blackout
        5: Perfect response
        """
        review, created = SRSReview.objects.get_or_create(
            user=user,
            flashcard=flashcard
        )
        
        if quality >= 3:
            # Successful review
            if review.repetition_count == 0:
                review.interval = 1
            elif review.repetition_count == 1:
                review.interval = 6
            else:
                review.interval = int(review.interval * review.ease_factor)
                
            review.repetition_count += 1
            
            # Ease Factor Adjustment
            # EF' := EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
            new_ef = review.ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
            review.ease_factor = max(1.3, new_ef)
        else:
            # Failed review - reset interval
            review.repetition_count = 0
            review.interval = 1
            
        review.last_review_date = timezone.now()
        review.next_review_date = timezone.now().date() + timedelta(days=review.interval)
        review.save()
        return review
