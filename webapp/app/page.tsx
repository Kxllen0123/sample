import { FeedbackForm } from './components/FeedbackForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-4 pb-24 sm:pt-6 sm:pb-28 md:pt-8 md:pb-32">
        <div className="flex flex-col items-center justify-start min-h-screen py-4">
          <div className="w-full max-w-2xl space-y-6 sm:space-y-8">
            <div className="text-center space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                用户反馈
              </h1>
              <p className="text-muted-foreground text-lg sm:text-xl">
                您的意见对我们很重要
              </p>
            </div>
            <FeedbackForm />
          </div>
        </div>
      </main>
    </div>
  );
}
