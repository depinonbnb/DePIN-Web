import { AlertTriangle } from 'lucide-react';

export function NoticeBanner() {
  return (
    <div className="w-full bg-muted/50 border-t border-b border-border">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-start gap-2 sm:gap-3">
          <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-foreground text-xs sm:text-sm mb-1">
              Important Notice: Limited Availability of Services for Certain Regions
            </h3>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
              Please be informed that certain services offered on this platform are not accessible to users 
              based in specific regions. Our commitment to regulatory compliance means that certain offerings 
              are reserved exclusively for eligible users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

