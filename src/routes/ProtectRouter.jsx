import { Navigate } from 'react-router-dom';
import { useAuthStore } from '/src/stores/useAuthStore';
import { useEffect, useState } from 'react';
function ProtectRouter({ children }) {
  // const isLogin = localStorage.getItem('accessToken');
  const { accessToken, user, loading, refresh, fetchMe } = useAuthStore();
  const [starting, setStarting] = useState(true);

  const init = async () => {
    // có thể xảy ra khi refresh trang
    if (!accessToken) {
      await refresh();
    }

    if (accessToken && !user) {
      await fetchMe();
    }

    setStarting(false);
  };

  useEffect(() => {
    init();
  }, []);

  if (starting || loading) {
    return <div className="flex h-screen items-center justify-center">Đang tải trang...</div>;
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
export default ProtectRouter;
