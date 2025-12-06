import { CopilotKit } from '@copilotkit/react-core';
import { CopilotSidebar } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
import KundelikDashboard from './components/KundelikDashboard';

function App() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <CopilotSidebar
        defaultOpen={true}
        labels={{
          title: "Kundelik Помощник",
          initial: "Здравствуйте! Я помогу вам с электронным журналом Kundelik.kz. Чем могу помочь?",
        }}
      >
        <KundelikDashboard />
      </CopilotSidebar>
    </CopilotKit>
  );
}

export default App;
