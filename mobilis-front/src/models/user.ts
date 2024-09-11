

class User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    location: {
      latitude: number;
      longitude: number;
    };
}

export default User;
