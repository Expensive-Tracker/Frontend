export interface userSliceState {
  userDetail: {
    username: string;
    email: string;
    password?: string;
    profilePic?: string;
    createdAt?: string;
    _id: string;
    updatedAt?: string;
    confirmPassword?: string;
  };
  token: string;
}

export interface themeSliceState {
  theme: "dark" | "light";
}

export interface uiSliceState {
  sidebar: {
    isHovered: boolean;
    mobileOpen: boolean;
    isOpen: boolean;
  };
}
