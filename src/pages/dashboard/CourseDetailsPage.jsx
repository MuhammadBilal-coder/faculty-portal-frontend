import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { PageHeader } from '../../components/layout/PageHeader';
import { api } from '../../services/mockApi';

export function CourseDetailsPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    api.courses.list().then((courses) => {
      setCourse(courses.find((item) => item.id === courseId) ?? null);
    });
  }, [courseId]);

  return (
    <section className="page-grid">
      <PageHeader
        title="Course Details"
        description="Detailed course context, schedule, and enrollment overview."
        actions={
          <Link to="/app/courses" className="btn btn-secondary btn-md">
            Back to Courses
          </Link>
        }
      />

      <Card>
        {!course ? (
          <EmptyState
            icon="📚"
            title="Course not found"
            description="The requested course could not be located."
          />
        ) : (
          <div className="detail-list">
            <div>
              <strong>Title</strong>
              <p>{course.title}</p>
            </div>
            <div>
              <strong>Code</strong>
              <p>{course.code}</p>
            </div>
            <div>
              <strong>Status</strong>
              <p>{course.status}</p>
            </div>
            <div>
              <strong>Semester</strong>
              <p>{course.semester}</p>
            </div>
            <div>
              <strong>Schedule</strong>
              <p>{course.schedule}</p>
            </div>
            <div>
              <strong>Room</strong>
              <p>{course.room}</p>
            </div>
            <div>
              <strong>Students</strong>
              <p>{course.studentCount}</p>
            </div>
            <div>
              <strong>Description</strong>
              <p>{course.description}</p>
            </div>
          </div>
        )}
      </Card>
    </section>
  );
}
