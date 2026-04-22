import json
import os
from django.core.management.base import BaseCommand
from django.db import transaction
from apps.content.models import Subject, Topic, Concept, Lesson, LessonSection

class Command(BaseCommand):
    help = 'Seed the database with Physics: Mechanics content'

    def add_arguments(self, parser):
        parser.add_argument('--file', type=str, help='Path to the JSON seed file', default='physics_mechanics.json')

    def handle(self, *args, **options):
        file_path = options['file']
        
        if not os.path.exists(file_path):
            self.stdout.write(self.style.ERROR(f"File {file_path} not found."))
            return

        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        try:
            with transaction.atomic():
                # 1. Subject
                subject_name = data.get('subject', 'physics')
                subject, created = Subject.objects.get_or_create(
                    name=subject_name.capitalize(),
                    defaults={'icon': 'atom', 'color': '#3b82f6'}
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f"Created Subject: {subject.name}"))

                # 2. Topics
                topic_centers = [
                    (400, 100),   # Topic 1: Top Center
                    (100, 300),   # Topic 2: Mid Left
                    (700, 300),   # Topic 3: Mid Right
                    (400, 500),   # Topic 4: Bottom Center
                    (100, 700),   # Topic 5: Bottom Left
                    (700, 700),   # Topic 6: Bottom Right
                    (400, 900),   # Topic 7: Far Bottom
                ]

                import random

                for t_idx, topic_data in enumerate(data.get('topics', [])):
                    topic, created = Topic.objects.get_or_create(
                        subject=subject,
                        title=topic_data['title'],
                        defaults={'level': topic_data.get('level', 'HS'), 'order': t_idx}
                    )
                    
                    center_x, center_y = topic_centers[t_idx % len(topic_centers)]

                    # 3. Concepts
                    last_concept = None
                    for c_idx, concept_data in enumerate(topic_data.get('concepts', [])):
                        # "Organic" clustering around the topic center
                        # Spiral-ish or random offset
                        angle = (c_idx / max(1, len(topic_data.get('concepts', [])) - 1)) * 6.28
                        dist = 120 + random.randint(-40, 40)
                        x = int(center_x + dist * (1.5 if c_idx % 2 == 0 else -1.5) * (c_idx % 3))
                        y = int(center_y + dist * (1 if c_idx < 3 else -1))
                        
                        # Simpler grid-like offset for "organic" feel but readable
                        x = center_x + (c_idx % 3) * 250 - 250
                        y = center_y + (c_idx // 3) * 180

                        concept, created = Concept.objects.get_or_create(
                            topic=topic,
                            title=concept_data['title'],
                            defaults={
                                'summary': concept_data['summary'],
                                'history_text': concept_data.get('history_text', ''),
                                'x_pos': x,
                                'y_pos': y
                            }
                        )
                        
                        # Sequential prerequisites within the topic
                        if last_concept:
                            concept.prerequisites.add(last_concept)
                        
                        last_concept = concept


                        # 4. Lessons
                        for lesson_data in concept_data.get('lessons', []):
                            lesson, created = Lesson.objects.get_or_create(
                                concept=concept,
                                title=lesson_data['title'],
                                defaults={'difficulty': lesson_data.get('difficulty', 1)}
                            )
                            if created:
                                self.stdout.write(self.style.SUCCESS(f"      Created Lesson: {lesson.title}"))
                            
                            # 5. Sections (Clear and rebuild to ensure freshness)
                            lesson.sections.all().delete()
                            for idx, section_data in enumerate(lesson_data.get('sections', [])):
                                LessonSection.objects.create(
                                    lesson=lesson,
                                    order=idx,
                                    type=section_data['type'],
                                    content=section_data.get('content', ''),
                                    component_config=section_data.get('component_config', {})
                                )
                            
                            # Trigger cache rebuild
                            lesson.rebuild_content_cache()

            self.stdout.write(self.style.SUCCESS("Successfully seeded content!"))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error seeding data: {str(e)}"))
