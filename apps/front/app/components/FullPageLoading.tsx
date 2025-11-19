import { Spinner } from '@taskly/design-system';

export function FullPageLoading() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-neutral-50">
      <Spinner size="lg" />
    </div>
  );
}
