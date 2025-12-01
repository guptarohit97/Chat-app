import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingUp: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in checkAuth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isSigningUp: false });
    }
  },
  login:async(data)=>{
      set({isLoggingUp:true})
      try{
            const res=await axiosInstance.post("/auth/login",data);
            set({authUser:res.data})
            toast.success("User Logged In")
      }
      catch(error){
            console.log("Login error:",error)
            toast.error(error.response?.data?.message)
      }finally{
            set({isLoggingUp:false})
      }
  },
  logout:async()=>{
      try{
            await axiosInstance.post("/auth/logout")
            toast.success("Logout Successfully")
      }catch(e){
            console.log("Logout Error",e)
            toast.error(e.response.data.message)
      }finally{
            set({authUser:null})
      }
  }

}));
