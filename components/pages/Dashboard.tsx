'use client';

export default function Dashboard() {
  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      change: '+12%',
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM4 20h16a2 2 0 002-2v-2a3 3 0 00-3-3H5a3 3 0 00-3 3v2a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: 'Pending Approvals',
      value: '45',
      change: '+8',
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: 'Active Products',
      value: '892',
      change: '+23%',
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10M4 12l8 4m8-4l-8-4"
          />
        </svg>
      ),
    },
    {
      title: 'Rejected Items',
      value: '12',
      change: '-2',
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back to your admin panel
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-lg p-6 hover:border-accent transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
              <div className="text-accent">{stat.icon}</div>
            </div>
            <p className="text-sm text-primary mt-4 font-medium">
              {stat.change} from last month
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[
              {
                action: 'New product submitted',
                user: 'John Doe',
                time: '2 hours ago',
              },
              {
                action: 'User account created',
                user: 'Jane Smith',
                time: '4 hours ago',
              },
              {
                action: 'Product approved',
                user: 'Admin',
                time: '6 hours ago',
              },
              {
                action: 'User deactivated',
                user: 'Admin',
                time: '1 day ago',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-border last:border-b-0"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {item.action}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.user}</p>
                </div>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">
            Quick Stats
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Approval Rate
                </span>
                <span className="text-sm font-bold text-foreground">85%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full w-4/5"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  User Growth
                </span>
                <span className="text-sm font-bold text-foreground">12%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-accent h-2 rounded-full w-3/12"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Product Quality
                </span>
                <span className="text-sm font-bold text-foreground">92%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full w-11/12"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
