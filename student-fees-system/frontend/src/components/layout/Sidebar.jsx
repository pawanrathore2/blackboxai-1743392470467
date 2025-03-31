import { NavLink } from 'react-router-dom';

const Sidebar = ({ role }) => {
  const adminLinks = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Students', path: '/admin/students' },
    { name: 'Fees', path: '/admin/fees' },
    { name: 'Payments', path: '/admin/payments' },
    { name: 'Reports', path: '/admin/reports' }
  ];

  const studentLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'My Fees', path: '/fees' },
    { name: 'Payment History', path: '/payments' },
    { name: 'Profile', path: '/profile' }
  ];

  const links = role === 'admin' ? adminLinks : studentLinks;

  return (
    <div className="w-64 bg-white shadow-md h-screen sticky top-0">
      <nav className="p-4">
        <div className="space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => 
                `block px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;