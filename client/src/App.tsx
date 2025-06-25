import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Onboarding from "@/pages/onboarding";
import Discovery from "@/pages/discovery";
import RoleMatching from "@/pages/role-matching";
import ApplicationBuilder from "@/pages/application-builder";
import ProgressDashboard from "@/pages/progress-dashboard";
import JourneyComplete from "@/pages/journey-complete";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/discovery" component={Discovery} />
      <Route path="/roles" component={RoleMatching} />
      <Route path="/application" component={ApplicationBuilder} />
      <Route path="/dashboard" component={ProgressDashboard} />
      <Route path="/complete" component={JourneyComplete} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="mobile-container">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
