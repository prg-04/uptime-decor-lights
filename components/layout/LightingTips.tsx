import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import { homeTips } from "@/constants/homeTips"; 

interface LightingTipsProps {
  title?: string | null; 
  description?: string | null; 
  buttonText?: string | null; 
  buttonLink?: string | null; 
}

const LightingTips: React.FC<LightingTipsProps> = ({
  title = homeTips.title, 
  description = homeTips.description, 
  buttonText = homeTips.buttonText, 
  buttonLink = homeTips.buttonLink, 
}) => {


  return (
    <section className="py-12 bg-secondary/50 rounded-lg my-10 px-6">
      <div className="container mx-auto text-center">
        <Lightbulb className="h-12 w-12 mx-auto text-accent mb-4" />
        {title && <h2 className="text-3xl font-bold mb-4">{title}</h2>}
        {description && (
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            {description}
          </p>
        )}
        {buttonText &&
          buttonLink && ( 
            <Button variant="outline" asChild className="interactive-button">
              <Link href={buttonLink}>{buttonText}</Link>
            </Button>
          )}
      </div>
    </section>
  );
};

export default LightingTips;
