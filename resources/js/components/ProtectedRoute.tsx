import { useAuth } from "@/context/AuthContext";
import { router } from "@inertiajs/react";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: any) {
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            router.visit("/login");
        }
    }, [user]);

    if (!user) return null; // prevent flashing

    return children;
}
