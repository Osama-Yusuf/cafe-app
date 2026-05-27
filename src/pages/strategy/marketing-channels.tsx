import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CHANNELS = [
  {
    title: 'Instagram & TikTok',
    content: 'Post 5x/week Instagram, 3x/week TikTok. 40% product, 30% BTS, 20% community, 10% education.',
  },
  {
    title: 'Influencer Playbook',
    content: '2-3 micro-influencers/month (5K-50K followers). Free drinks + content.',
  },
  {
    title: 'Google Maps & Reviews',
    content: 'Claim listing day 1. Target 50 reviews in 3 months, 4.7+ stars.',
  },
  {
    title: 'Events & Community',
    content: 'Monthly cupping. Quarterly latte art throwdown. Partner with local businesses.',
  },
];

const CALENDAR = [
  { day: 'Sat', instagram: 'Drink photo', tiktok: 'Making-of reel', type: 'Product' },
  { day: 'Sun', instagram: 'Behind-the-scenes', tiktok: '—', type: 'BTS' },
  { day: 'Mon', instagram: 'Customer spotlight', tiktok: '—', type: 'Community' },
  { day: 'Tue', instagram: 'Coffee education', tiktok: 'Quick tip', type: 'Education' },
  { day: 'Wed', instagram: 'New item', tiktok: '—', type: 'Product' },
  { day: 'Thu', instagram: 'Story polls', tiktok: 'Trending sound', type: 'Engagement' },
  { day: 'Fri', instagram: 'Weekend vibe', tiktok: 'Fun', type: 'BTS' },
];

function ChannelStrategy() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-text">Channel Strategy</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CHANNELS.map((ch) => (
          <Card key={ch.title} className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-gold text-sm">{ch.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text2 leading-relaxed">{ch.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ContentCalendar() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-text">Content Calendar</h3>
      <Card className="bg-card border-border">
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 text-text3 font-semibold text-xs uppercase tracking-wider">Day</th>
                  <th className="text-left py-2 pr-4 text-text3 font-semibold text-xs uppercase tracking-wider">Instagram</th>
                  <th className="text-left py-2 pr-4 text-text3 font-semibold text-xs uppercase tracking-wider">TikTok</th>
                  <th className="text-left py-2 text-text3 font-semibold text-xs uppercase tracking-wider">Type</th>
                </tr>
              </thead>
              <tbody>
                {CALENDAR.map((row) => (
                  <tr key={row.day} className="border-b border-border last:border-0">
                    <td className="py-2 pr-4 font-bold text-text">{row.day}</td>
                    <td className="py-2 pr-4 text-text2">{row.instagram}</td>
                    <td className="py-2 pr-4 text-text2">{row.tiktok}</td>
                    <td className="py-2">
                      <span className="text-xs text-gold font-medium px-2 py-0.5 rounded-full bg-gold/10">
                        {row.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function MarketingChannels() {
  return (
    <>
      <ChannelStrategy />
      <ContentCalendar />
    </>
  );
}
