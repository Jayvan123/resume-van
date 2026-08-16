import { Header } from '@/components/layout/Header';
import { SplitLayout } from '@/components/layout/SplitLayout';
import { LeftPanel } from '@/components/left-panel/LeftPanel';
import { ResumePreview } from '@/components/right-panel/ResumePreview';
import { useResumeStore } from '@/lib/store/resume.slice';
import { downloadPDF } from '@/lib/pdf/generate';

function App() {
  const { data, loadSampleData, isDownloading, setIsDownloading } = useResumeStore();

  const hasData =
    data.personal.fullName !== '' ||
    data.experience.length > 0 ||
    data.education.length > 0;

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadPDF(data);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header
        onDownload={handleDownload}
        onLoadSample={loadSampleData}
        hasData={hasData}
        isDownloading={isDownloading}
      />
      <div className="flex-1 flex overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>
        <SplitLayout
          leftPanel={<LeftPanel />}
          rightPanel={<ResumePreview />}
        />
      </div>
    </div>
  );
}

export default App;
