import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TradingViewWidget from "react-tradingview-widget";

interface TradingViewChartProps {
  ticker: string;
}

const TradingViewChart = ({ ticker }: TradingViewChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Chart - {ticker}</CardTitle>
        <CardDescription>Professional TradingView chart with real-time data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <TradingViewWidget
            symbol={ticker}
            theme="Light"
            autosize
            hide_side_toolbar={false}
            studies={["RSI", "MACD"]}
            interval="D"
            toolbar_bg="#f1f3f6"
            enable_publishing={false}
            allow_symbol_change={true}
            save_image={false}
            hide_volume={false}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingViewChart;