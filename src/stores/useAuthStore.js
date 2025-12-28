import { create } from 'zustand';
import { message } from 'antd';
import { authService } from '/src/services/authService/authService';

export const useAuthStore = create((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  setAccessToken: (accessToken) => {
    set({ accessToken });
  },
  clearState: () => {
    set({ accessToken: null, user: null, loading: false });
  },

  signUp: async (username, password, email, firstName, lastName) => {
    try {
      set({ loading: true });

      //  gọi api
      await authService.signUp(username, password, email, firstName, lastName);

      message.success('Đăng ký thành công! Bạn sẽ được chuyển sang trang đăng nhập.');
    } catch (error) {
      console.error(error);
      message.error('Đăng ký không thành công');
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (username, password) => {
    try {
      set({ loading: true });

      const { accessToken } = await authService.signIn(username, password);
      get().setAccessToken(accessToken);

      await get().fetchMe();

      message.success('Chào mừng bạn quay lại với phần mềm quản lý thiết bị 🎉');
    } catch (error) {
      console.error(error);
      message.error('Đăng nhập không thành công!');
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      get().clearState();
      await authService.signOut();
      message.success('Logout thành công!');
    } catch (error) {
      console.error(error);
      message.error('Lỗi xảy ra khi logout. Hãy thử lại!');
    }
  },

  fetchMe: async () => {
    try {
      set({ loading: true });
      const user = await authService.fetchMe();

      set({ user });
    } catch (error) {
      console.error(error);
      set({ user: null, accessToken: null });
      message.error('Lỗi xảy ra khi lấy dữ liệu người dùng. Hãy thử lại!');
    } finally {
      set({ loading: false });
    }
  },

  refresh: async () => {
    try {
      set({ loading: true });
      const { user, fetchMe, setAccessToken } = get();
      const accessToken = await authService.refresh();

      setAccessToken(accessToken);

      if (!user) {
        await fetchMe();
      }
    } catch (error) {
      console.error(error);
      message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
      get().clearState();
    } finally {
      set({ loading: false });
    }
  }
}));
