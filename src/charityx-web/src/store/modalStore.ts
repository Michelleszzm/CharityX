import { create } from "zustand"

interface ResetPasswordParam {
  email: string
  token: string
}
interface ModalStore {
  loginModalOpen: boolean
  setLoginModalOpen: (open: boolean) => void
  registerModalOpen: boolean
  setRegisterModalOpen: (open: boolean) => void
  profileModalOpen: boolean
  setProfileModalOpen: (open: boolean) => void
  submitSuccessfullyModalOpen: boolean
  setSubmitSuccessfullyModalOpen: (open: boolean) => void

  resetPasswordModalOpen: boolean
  setResetPasswordModalOpen: (open: boolean) => void

  changePasswordModalOpen: boolean
  resetPasswordParam: ResetPasswordParam
  setChangePasswordModalOpen: (open: boolean) => void
  openChangePasswordModalOpen: (param: ResetPasswordParam) => void

  // application delete dialog
  applicationDeleteModalOpen: boolean
  setApplicationDeleteModalOpen: (open: boolean) => void
}

const useModalStore = create<ModalStore>(set => ({
  loginModalOpen: false,
  setLoginModalOpen: (open: boolean) => set({ loginModalOpen: open }),
  registerModalOpen: false,
  setRegisterModalOpen: (open: boolean) => set({ registerModalOpen: open }),
  profileModalOpen: false,
  setProfileModalOpen: (open: boolean) => set({ profileModalOpen: open }),
  resetPasswordModalOpen: false,
  resetPasswordParam: { email: "", token: "" },
  
  setResetPasswordModalOpen: (open: boolean) => set({ resetPasswordModalOpen: open }),
  changePasswordModalOpen: false,
  setChangePasswordModalOpen: (open: boolean) => set({ changePasswordModalOpen: open }),
  openChangePasswordModalOpen: (param: ResetPasswordParam) => set({ changePasswordModalOpen: true, resetPasswordParam: param }),
  submitSuccessfullyModalOpen: false,
  setSubmitSuccessfullyModalOpen: (open: boolean) => set({ submitSuccessfullyModalOpen: open }),
  applicationDeleteModalOpen: false,
  setApplicationDeleteModalOpen: (open: boolean) => set({ applicationDeleteModalOpen: open }),
}))

export default useModalStore
