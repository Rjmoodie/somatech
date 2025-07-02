import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FinancialStatementsProps {
  ticker: string;
}

const FinancialStatements = ({ ticker }: FinancialStatementsProps) => {
  // Dynamic mock data based on ticker
  const getFinancialData = (ticker: string) => {
    const baseData = {
      AAPL: {
        revenue: [383285, 394328, 365817, 274515, 260174],
        grossProfit: [169148, 170782, 152836, 104956, 98392],
        operatingIncome: [114301, 119437, 108949, 66288, 63930],
        netIncome: [96995, 99803, 94680, 57411, 55256]
      },
      TSLA: {
        revenue: [96773, 81462, 53823, 31536, 24578],
        grossProfit: [17660, 13606, 11811, 6630, 4069],
        operatingIncome: [8891, 13656, 6523, 2021, 69],
        netIncome: [14997, 12587, 5519, 721, -775]
      },
      MSFT: {
        revenue: [211915, 198270, 168088, 143015, 125843],
        grossProfit: [146052, 135620, 115856, 96937, 82933],
        operatingIncome: [88523, 83383, 69916, 52959, 42959],
        netIncome: [72361, 72738, 61271, 44281, 39240]
      },
      GOOGL: {
        revenue: [307394, 282836, 257637, 182527, 161857],
        grossProfit: [181084, 157628, 153912, 104062, 89961],
        operatingIncome: [84299, 74842, 78714, 41224, 34231],
        netIncome: [73795, 76033, 76311, 40269, 34343]
      },
      AMZN: {
        revenue: [574785, 513983, 469822, 386064, 280522],
        grossProfit: [270035, 225152, 197478, 152757, 114986],
        operatingIncome: [24879, 22548, 24879, 22548, 14541],
        netIncome: [30425, -2722, 21331, 21331, 11588]
      }
    };

    const defaultData = {
      revenue: [185420, 172350, 158760, 142890, 128450],
      grossProfit: [78230, 73420, 68910, 62340, 56780],
      operatingIncome: [32180, 29870, 27650, 24320, 21890],
      netIncome: [24560, 22890, 20780, 18340, 16120]
    };

    return baseData[ticker as keyof typeof baseData] || defaultData;
  };

  const data = getFinancialData(ticker);

  const incomeStatement = {
    revenue: [
      { period: "2023", value: data.revenue[0] },
      { period: "2022", value: data.revenue[1] },
      { period: "2021", value: data.revenue[2] },
      { period: "2020", value: data.revenue[3] },
      { period: "2019", value: data.revenue[4] }
    ],
    grossProfit: [
      { period: "2023", value: data.grossProfit[0] },
      { period: "2022", value: data.grossProfit[1] },
      { period: "2021", value: data.grossProfit[2] },
      { period: "2020", value: data.grossProfit[3] },
      { period: "2019", value: data.grossProfit[4] }
    ],
    operatingIncome: [
      { period: "2023", value: data.operatingIncome[0] },
      { period: "2022", value: data.operatingIncome[1] },
      { period: "2021", value: data.operatingIncome[2] },
      { period: "2020", value: data.operatingIncome[3] },
      { period: "2019", value: data.operatingIncome[4] }
    ],
    netIncome: [
      { period: "2023", value: data.netIncome[0] },
      { period: "2022", value: data.netIncome[1] },
      { period: "2021", value: data.netIncome[2] },
      { period: "2020", value: data.netIncome[3] },
      { period: "2019", value: data.netIncome[4] }
    ]
  };

  // Generate balance sheet and cash flow based on income data
  const balanceSheet = {
    totalAssets: incomeStatement.revenue.map(item => ({ 
      period: item.period, 
      value: item.value * 0.92 
    })),
    totalLiabilities: incomeStatement.revenue.map(item => ({ 
      period: item.period, 
      value: item.value * 0.76 
    })),
    shareholderEquity: incomeStatement.revenue.map(item => ({ 
      period: item.period, 
      value: item.value * 0.16 
    })),
    totalDebt: incomeStatement.revenue.map(item => ({ 
      period: item.period, 
      value: item.value * 0.32 
    }))
  };

  const cashFlow = {
    operatingCashFlow: incomeStatement.netIncome.map(item => ({ 
      period: item.period, 
      value: item.value * 1.14 
    })),
    freeCashFlow: incomeStatement.netIncome.map(item => ({ 
      period: item.period, 
      value: item.value * 0.87 
    })),
    capex: incomeStatement.revenue.map(item => ({ 
      period: item.period, 
      value: item.value * -0.067 
    }))
  };

  const formatNumber = (num: number) => {
    if (Math.abs(num) >= 1000) {
      return `$${(num / 1000).toFixed(1)}B`;
    }
    return `$${num.toFixed(0)}M`;
  };

  const renderFinancialTable = (data: Record<string, Array<{ period: string; value: number }>>, title: string) => (
    <div className="space-y-4">
      <h4 className="font-semibold">{title}</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 font-medium">Metric</th>
              {data[Object.keys(data)[0]].map(item => (
                <th key={item.period} className="text-right py-2 font-medium">{item.period}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(data).map(([key, values]) => (
              <tr key={key} className="border-b">
                <td className="py-2 font-medium">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </td>
                {values.map(item => (
                  <td key={item.period} className="text-right py-2">
                    {formatNumber(item.value)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{ticker} Financial Statements</CardTitle>
        <CardDescription>
          Complete financial statements for {ticker} with 5-year historical data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="income" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="income">Income Statement</TabsTrigger>
            <TabsTrigger value="balance">Balance Sheet</TabsTrigger>
            <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          </TabsList>
          
          <TabsContent value="income" className="mt-6">
            {renderFinancialTable(incomeStatement, `${ticker} Income Statement (in millions)`)}
          </TabsContent>
          
          <TabsContent value="balance" className="mt-6">
            {renderFinancialTable(balanceSheet, `${ticker} Balance Sheet (in millions)`)}
          </TabsContent>
          
          <TabsContent value="cashflow" className="mt-6">
            {renderFinancialTable(cashFlow, `${ticker} Cash Flow Statement (in millions)`)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FinancialStatements;