import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserUncheckedCreateInputObjectSchema } from "@repo/db/usedSchemas";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Calendar, Users, Shield } from "lucide-react";
import { CheckedState } from "@radix-ui/react-checkbox";

const insertUserSchema = (UserUncheckedCreateInputObjectSchema as unknown as z.ZodObject<any>).pick({
  username: true,
  password: true,
});

const loginSchema = (insertUserSchema as unknown as z.ZodObject<any>).extend({
  rememberMe: z.boolean().optional(),
});


const registerSchema = (insertUserSchema as unknown as z.ZodObject<any>).extend({
  confirmPassword: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
  agreeTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms and conditions" }),
  }),
}).refine((data:any) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user, loginMutation, registerMutation } = useAuth();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
  });

  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate({
      username: data.username,
      password: data.password,
    });
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate({
      username: data.username,
      password: data.password,
    });
  };

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 shadow-xl rounded-xl overflow-hidden">
        {/* Auth Forms */}
        <Card className="p-6 bg-white border-0 rounded-none">
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-3">
              <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                  <path d="M12 14c-1.65 0-3-1.35-3-3V5c0-1.65 1.35-3 3-3s3 1.35 3 3v6c0 1.65-1.35 3-3 3Z" />
                  <path d="M19 14v-4a7 7 0 0 0-14 0v4" />
                  <path d="M12 19c-5 0-8-2-9-5.5m18 0c-1 3.5-4 5.5-9 5.5Z" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Dental Connect</h1>
            <p className="text-gray-500 text-sm">Clinic Management System</p>
          </div>

          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your username"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your password"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between">
                    <FormField
                      control={loginForm.control}
                      name="rememberMe"
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="remember-me"
                            checked={field.value as CheckedState}
                            onCheckedChange={field.onChange}
                          />
                          <label
                            htmlFor="remember-me"
                            className="text-sm font-medium text-gray-700"
                          >
                            Remember me
                          </label>
                        </div>
                      )}
                    />
                    <a href="#" className="text-sm font-medium text-primary hover:text-primary/80">
                      Forgot password?
                    </a>
                  </div>

                  <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                    {loginMutation.isPending ? "Signing in..." : "Sign in"}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="register">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Choose a username"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Create a password"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Confirm your password"
                            type="password"
                            {...field}
                            value={typeof field.value === 'string' ? field.value : ''}

                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="agreeTerms"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-2 mt-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value as CheckedState}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I agree to the <a href="#" className="text-primary">Terms and Conditions</a>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                    {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Hero Section */}
        <div className="hidden md:flex bg-primary p-8 text-white flex-col justify-center">
          <h2 className="text-2xl font-bold mb-3">Welcome to Dental Connect</h2>
          <p className="mb-8 text-white/80 text-sm leading-relaxed">
            Streamline your dental clinic workflows. Manage appointments, patient records, staff, and treatment history all in one place.
          </p>
          <ul className="space-y-4">
            <li className="flex items-start space-x-3">
              <div className="mt-0.5 h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <span className="font-medium text-sm">Appointment Scheduling</span>
                <p className="text-xs text-white/70 mt-0.5">Schedule and track patient visits with ease</p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <div className="mt-0.5 h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <span className="font-medium text-sm">Patient Management</span>
                <p className="text-xs text-white/70 mt-0.5">Complete patient records and medical history</p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <div className="mt-0.5 h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <span className="font-medium text-sm">Secure & Compliant</span>
                <p className="text-xs text-white/70 mt-0.5">JWT authentication and data validation</p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <div className="mt-0.5 h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-4 w-4" />
              </div>
              <div>
                <span className="font-medium text-sm">Simple Interface</span>
                <p className="text-xs text-white/70 mt-0.5">Intuitive design for clinic staff</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
