'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { submitFeedback, type FeedbackResponse } from '@/app/actions/feedback';
import { Loader2 } from 'lucide-react';

interface FeedbackFormState {
  content: string;
  isLoading: boolean;
  message?: string;
  success?: boolean;
}

// 客户端最大长度限制（与服务器端保持一致）
const MAX_LENGTH = 5000;

export function FeedbackForm() {
  const [state, setState] = useState<FeedbackFormState>({
    content: '',
    isLoading: false,
  });
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  // 当消息出现时，滚动到按钮位置
  useEffect(() => {
    if (state.message && !state.isLoading && submitButtonRef.current) {
      setTimeout(() => {
        submitButtonRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100);
    }
  }, [state.message, state.isLoading]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // 客户端基本验证
    const trimmedContent = state.content.trim();
    if (!trimmedContent) {
      setState((prev) => ({
        ...prev,
        message: '请输入反馈内容',
        success: false,
      }));
      return;
    }

    if (trimmedContent.length > MAX_LENGTH) {
      setState((prev) => ({
        ...prev,
        message: `反馈内容不能超过 ${MAX_LENGTH} 个字符`,
        success: false,
      }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, message: undefined }));

    try {
      const result: FeedbackResponse = await submitFeedback(state.content);
      
      console.log('=== 前端收到响应 ===');
      console.log('成功状态:', result.success);
      console.log('消息内容:', result.message);
      console.log('=== 前端响应结束 ===');
      
      setState((prev) => ({
        ...prev,
        isLoading: false,
        message: result.message || '反馈已提交', // 确保有消息显示
        success: result.success,
        content: result.success ? '' : prev.content, // 成功时清空表单
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        message: '提交失败，请稍后再试',
        success: false,
      }));
    }
  };

  const remainingChars = MAX_LENGTH - state.content.length;
  const isNearLimit = remainingChars < 100;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardDescription>
          请分享您的功能增强建议、程序错误或提问我们会认真对待每一条反馈
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="feedback-content">反馈内容</Label>
            <Textarea
              id="feedback-content"
              placeholder="请输入您的反馈内容..."
              value={state.content}
              onChange={(e) =>
                setState((prev) => ({ ...prev, content: e.target.value }))
              }
              disabled={state.isLoading}
              rows={12}
              className={`resize-none min-h-[200px] sm:min-h-[250px] ${
                state.isLoading ? 'opacity-60 cursor-not-allowed' : ''
              }`}
              maxLength={MAX_LENGTH}
              aria-invalid={state.message && !state.success ? true : undefined}
            />
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">
                最多 {MAX_LENGTH} 个字符
              </span>
              <span
                className={
                  isNearLimit
                    ? 'text-destructive font-medium'
                    : 'text-muted-foreground'
                }
              >
                剩余 {remainingChars} 字符
              </span>
            </div>
          </div>

          {state.message && (
            <div
              className={`p-3 rounded-md text-sm ${
                state.success
                  ? 'bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200 border border-red-200 dark:border-red-800'
              }`}
              role="alert"
            >
              {state.message}
            </div>
          )}

          <Button
            ref={submitButtonRef}
            type="submit"
            disabled={state.isLoading || !state.content.trim()}
            className="w-full"
            size="lg"
          >
            {state.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                提交中...
              </>
            ) : (
              '提交反馈'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
