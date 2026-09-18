import { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { Skeleton } from '../../components/common/Skeleton';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/common/Button';
import { ErrorState } from '../../components/common/ErrorState';
import { api } from '../../services/mockApi';
import { useNotifications } from '../../contexts/NotificationContext';

export function DashboardHome() {
  const { pushToast } = useNotifications();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadData = async () => {
    setHasError(false);
    setLoading(true);

    try {
      const [statsPayload, activityPayload] = await Promise.all([
        api.dashboard.stats(),
        api.dashboard.activity(),
      ]);
      setStats(statsPayload);
      setActivities(activityPayload);
    } catch {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (hasError) {
    return (
      <ErrorState
        title="Dashboard data unavailable"
        description="We could not load analytics right now. Please retry in a few moments."
        onRetry={loadData}
      />
    );
  }

  return (
    <section className="page-grid">
      <header className="page-header">
        <div>
          <h2>Dashboard Overview</h2>
          <p>Track classes, submissions, communication, and productivity from one command center.</p>
        </div>
        <div className="page-actions">
          <Button
            variant="secondary"
            onClick={() =>
              pushToast({ type: 'info', title: 'Reports queue started', message: 'Weekly faculty report is generating.' })
            }
          >
            Generate weekly report
          </Button>
          <Button
            onClick={() =>
              pushToast({
                type: 'success',
                title: 'Office hours published',
                message: 'Students have been notified about your updated schedule.',
              })
            }
          >
            Publish office hours
          </Button>
        </div>
      </header>

      {loading ? (
        <Card>
          <Skeleton lines={6} />
        </Card>
      ) : (
        <div className="stats-grid">
          <StatCard icon="🎓" label="Total Students" value={stats.students} trend={{ direction: 'up', text: '+12 this semester' }} />
          <StatCard icon="📚" label="Active Courses" value={stats.courses} trend={{ direction: 'up', text: '+1 from last term' }} />
          <StatCard icon="📝" label="Assignments" value={stats.assignments} trend={{ direction: 'down', text: '3 pending closure' }} />
          <StatCard icon="✅" label="Attendance Rate" value={`${stats.attendanceRate}%`} trend={{ direction: 'up', text: '+4% this week' }} />
        </div>
      )}

      <div className="dashboard-columns">
        <Card
          title="Recent Activity"
          subtitle="Latest updates from your classes and students"
          actions={<Button variant="ghost">View all</Button>}
        >
          {loading ? (
            <Skeleton lines={5} />
          ) : (
            <ul className="activity-feed">
              {activities.map((item) => (
                <li key={item.id}>
                  <div className="activity-icon">{item.icon}</div>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.detail}</p>
                    <small>{item.when}</small>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Quick Actions" subtitle="High-frequency operations">
          <div className="quick-actions-grid">
            <Button variant="outline" onClick={() => pushToast({ type: 'info', title: 'Attendance', message: 'Opening attendance workflow.' })}>
              Mark attendance
            </Button>
            <Button variant="outline" onClick={() => pushToast({ type: 'info', title: 'Course update', message: 'Redirecting to course creation.' })}>
              Create course
            </Button>
            <Button variant="outline" onClick={() => pushToast({ type: 'info', title: 'Compose message', message: 'Launching compose modal.' })}>
              Message class
            </Button>
            <Button variant="outline" onClick={() => pushToast({ type: 'info', title: 'Assignment', message: 'Opening assignment authoring flow.' })}>
              New assignment
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
