import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Coffee } from 'lucide-react'

function App() {
  return (
    <div className="dark min-h-dvh bg-background text-foreground flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <Coffee className="mx-auto mb-2 text-gold" size={40} />
          <CardTitle className="text-2xl">Café Planner</CardTitle>
          <p className="text-sm text-muted-foreground">Stack is ready. Building pages next.</p>
        </CardHeader>
        <CardContent className="text-center">
          <Button>Get Started</Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default App
