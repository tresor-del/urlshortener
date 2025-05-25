import { jwtDecode }from "jwt-decode";

const decodeToken = (token) => {
      try {
          return jwtDecode(token)
      } catch (error) {
          console.error('Error decoding token:', error);
          return null;
      }
    };

export default decodeToken