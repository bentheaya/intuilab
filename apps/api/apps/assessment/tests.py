from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from django.utils import timezone
from unittest.mock import patch
import json
import datetime

from apps.content.models import Subject, Topic, Concept, Lesson, AssessmentItem
from apps.assessment.models import ConceptMastery, Flashcard, SRSReview, StudentInsight
from apps.assessment.services import MasteryService, SRSService

User = get_user_model()

class MasteryServiceTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="teststudent", password="password123")
        self.subject = Subject.objects.create(name="Physics")
        self.topic = Topic.objects.create(subject=self.subject, title="Mechanics")
        self.concept = Concept.objects.create(
            topic=self.topic, 
            title="Angular Momentum", 
            slug="angular-momentum", 
            summary="L = r x p"
        )

    def test_bkt_correct_answer_increases_p_known(self):
        # Initial mastery update (correct answer)
        mastery = MasteryService.update_mastery(
            user=self.user,
            concept=self.concept,
            is_correct=True,
            p_slip=0.1,
            p_guess=0.2
        )
        self.assertGreater(mastery.p_known, 0.15) # Default p_init is 0.15, should increase

        # Second correct answer should increase it even more
        old_p = mastery.p_known
        mastery = MasteryService.update_mastery(
            user=self.user,
            concept=self.concept,
            is_correct=True,
            p_slip=0.1,
            p_guess=0.2
        )
        self.assertGreater(mastery.p_known, old_p)

    def test_bkt_incorrect_answer_decreases_p_known(self):
        # Set up a high initial mastery
        ConceptMastery.objects.create(user=self.user, concept=self.concept, p_known=0.8)

        # Incorrect answer should drop p_known
        mastery = MasteryService.update_mastery(
            user=self.user,
            concept=self.concept,
            is_correct=False,
            p_slip=0.1,
            p_guess=0.2
        )
        self.assertLess(mastery.p_known, 0.8)


class SRSServiceTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="teststudent", password="password123")
        self.subject = Subject.objects.create(name="Chemistry")
        self.topic = Topic.objects.create(subject=self.subject, title="Acids")
        self.concept = Concept.objects.create(
            topic=self.topic, 
            title="pH scale", 
            slug="ph-scale", 
            summary="pH = -log[H+]"
        )
        self.flashcard = Flashcard.objects.create(
            concept=self.concept,
            front_text="What is the definition of pH?",
            back_text="pH is the negative logarithm of hydronium concentration."
        )

    def test_srs_good_review_extends_interval(self):
        # First good review (quality = 4)
        review1 = SRSService.record_review(self.user, self.flashcard, quality=4)
        self.assertEqual(review1.interval, 1)
        self.assertEqual(review1.repetition_count, 1)

        # Second good review (quality = 5) should step to 6 days
        review2 = SRSService.record_review(self.user, self.flashcard, quality=5)
        self.assertEqual(review2.interval, 6)
        self.assertEqual(review2.repetition_count, 2)

    def test_srs_poor_review_resets_interval(self):
        # Establish repetitions
        SRSService.record_review(self.user, self.flashcard, quality=4)
        SRSService.record_review(self.user, self.flashcard, quality=4)

        # Poor review (quality = 1) should reset repetitions and set interval to 1
        review = SRSService.record_review(self.user, self.flashcard, quality=1)
        self.assertEqual(review.repetition_count, 0)
        self.assertEqual(review.interval, 1)


class InsightsAPITests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username="teststudent", password="password123")
        self.client.login(username="teststudent", password="password123")
        
        self.subject = Subject.objects.create(name="Physics")
        self.topic = Topic.objects.create(subject=self.subject, title="Mechanics")
        self.concept = Concept.objects.create(
            topic=self.topic, 
            title="Momentum", 
            slug="momentum", 
            summary="P = mv"
        )

    def test_insights_crud_lifecycle(self):
        # 1. Create an insight via POST
        payload = {
            "title": "Linear momentum conservation",
            "insight_type": "derivation",
            "subject": "physics",
            "summary": "Verified that momentum is preserved under translation symmetry.",
            "tags": ["Mechanics", "Symmetry"]
        }
        res_post = self.client.post(
            "/api/v1/assessment/insights", 
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(res_post.status_code, 200)
        res_data = res_post.json()
        self.assertEqual(res_data["status"], "success")
        insight_id = res_data["insight_id"]

        # Verify created model in DB
        insight = StudentInsight.objects.get(id=insight_id)
        self.assertEqual(insight.title, payload["title"])
        self.assertEqual(insight.user, self.user)

        # 2. Retrieve insights list via GET
        res_get = self.client.get("/api/v1/assessment/insights")
        self.assertEqual(res_get.status_code, 200)
        insights_list = res_get.json()
        self.assertEqual(len(insights_list), 1)
        self.assertEqual(insights_list[0]["title"], payload["title"])

        # 3. Delete insight via DELETE
        res_delete = self.client.delete(f"/api/v1/assessment/insights/{insight_id}")
        self.assertEqual(res_delete.status_code, 200)
        self.assertEqual(res_delete.json()["status"], "success")
        
        # Verify deleted in DB
        self.assertFalse(StudentInsight.objects.filter(id=insight_id).exists())


class FeynmanAPITests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username="teststudent", password="password123")
        self.client.login(username="teststudent", password="password123")
        
        self.subject = Subject.objects.create(name="Physics")
        self.topic = Topic.objects.create(subject=self.subject, title="Mechanics")
        self.concept = Concept.objects.create(
            topic=self.topic, 
            title="Symmetry", 
            slug="symmetry", 
            summary="Symmetry principles in physics"
        )

    @patch('apps.ai.services.orchestrator.SocraticOrchestrator.evaluate_feynman_explanation')
    def test_feynman_score_updates_mastery(self, mock_evaluate):
        # Mock evaluation response
        mock_evaluate.return_value = {
            "score": 85,
            "clarity": 4,
            "depth": 5,
            "intuition": 4,
            "feedback": "Outstanding simple explanation!"
        }

        payload = {
            "concept_slug": "symmetry",
            "explanation": "Nature doesn't change its laws when you move to a different place."
        }

        res = self.client.post(
            "/api/v1/assessment/feynman/score",
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["score"], 85)
        self.assertTrue(data["mastery_updated"])

        # Verify BKT Mastery was updated in DB and increased
        mastery = ConceptMastery.objects.get(user=self.user, concept=self.concept)
        self.assertGreater(mastery.p_known, 0.15)
