export default function Loading() {
  return (
    <div className="flex min-h-[80svh] items-center justify-center" role="status" aria-label="Loading">
      <div className="w-40">
        <div className="h-px overflow-hidden bg-line">
          <div className="h-px w-1/3 animate-[loadbar_1.2s_var(--ease-cine)_infinite] bg-lime" />
        </div>
        <p className="label mt-3 text-center">Rolling</p>
      </div>
    </div>
  );
}
