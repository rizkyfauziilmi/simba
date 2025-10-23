"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertCircle } from "lucide-react";
import ProfileInfoForm from "./profile-info-form";
import PasswordChangeForm from "./password-change-form";
import SessionManagment from "./session-managment";
import { authClient } from "@/lib/auth-client";
import { formattedDate } from "@/lib/date";

export default function ProfileSettings() {
  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();

  const handleProfileUpdate = () => {
    refetch();
  };

  if (isPending) {
    return <div>Memuat data profil...</div>;
  }

  if (error || !session) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Terjadi kesalahan saat memuat data profil
        </AlertDescription>
      </Alert>
    );
  }

  const user = session.user;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Pengaturan Profil
        </h1>
        <p className="text-muted-foreground">
          Kelola informasi akun dan preferensi keamanan Anda
        </p>
      </div>

      {/* User Profile Card */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.image || undefined} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription>@{user.username}</CardDescription>
              <p className="text-xs text-muted-foreground mt-1">
                Bergabung pada {formattedDate(user.createdAt)}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="password">Keamanan</TabsTrigger>
          <TabsTrigger value="sessions">Sesi</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <ProfileInfoForm user={user} onUpdate={handleProfileUpdate} />
        </TabsContent>

        {/* Password Tab */}
        <TabsContent value="password">
          <PasswordChangeForm />
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions">
          <SessionManagment />
        </TabsContent>
      </Tabs>
    </div>
  );
}
