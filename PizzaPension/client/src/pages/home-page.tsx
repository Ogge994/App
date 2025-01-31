import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRegistrationSchema } from "@db/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const PIZZA_OPTIONS = [
  "Hawaii",
  "Kebabpizza",
  "Tomaso",
  "La Maffia",
  "Capriciosa",
  "Cacciatora",
  "Vesuvio",
];

const DRINK_OPTIONS = [
  "Vatten",
  "Läsk",
  "Öl",
  "Vin",
];

export default function HomePage() {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(insertRegistrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      pizza: "",
      drink: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/register-event", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Registrering mottagen!",
        description: "Tack för din anmälan till Pizza & Pension.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Ett fel uppstod",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-red-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Pizza & Pension Anmälan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="bg-muted">
            <Info className="h-5 w-5" />
            <AlertDescription className="ml-2">
              <p className="font-medium mb-2">Välkommen till Pizza & Pension!</p>
              <ul className="list-disc list-inside space-y-1">
                <li><span className="font-medium">När?</span> Onsdagen den 26 Februari, start kl. 15:50 med pizza</li>
                <li><span className="font-medium">Var?</span> Portalen, E-hallen</li>
                <li><span className="font-medium">För vem?</span> Medlemmar som är 35 år eller yngre</li>
                <li>Pensionsgenomgång med Leif Hjelman från Folksam</li>
                <li>Vi bjuder på pizza och dryck</li>
                <li>Begränsat till 18 deltagare - först till kvarn!</li>
                <li className="font-medium text-red-600">OBS! Sker på obetald tid</li>
                <li className="font-medium">Anmäl dig senast 14 Februari!</li>
              </ul>
            </AlertDescription>
          </Alert>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => registerMutation.mutate(data))}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Förnamn</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Efternamn</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-post</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pizza"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pizza</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Välj pizza" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PIZZA_OPTIONS.map((pizza) => (
                          <SelectItem key={pizza} value={pizza}>
                            {pizza}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="drink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dryck</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Välj dryck" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DRINK_OPTIONS.map((drink) => (
                          <SelectItem key={drink} value={drink}>
                            {drink}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between">
                <Button
                  type="submit"
                  disabled={registerMutation.isPending}
                >
                  Skicka anmälan
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  asChild
                >
                  <Link href="/admin">Admin</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}