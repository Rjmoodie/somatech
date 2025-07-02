import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FinancialStatementsProps {
  ticker: string;
}

const FinancialStatements = ({ ticker }: FinancialStatementsProps) => {
  // Mock data - in real implementation, this would be fetched based on ticker
  const incomeStatement = {
    revenue: [
      { period: "2023", value: 383285 },
      { period: "2022", value: 394328 },
      { period: "2021", value: 365817 },
      { period: "2020", value: 274515 },
      { period: "2019", value: 260174 }
    ],
    grossProfit: [
      { period: "2023", value: 169148 },
      { period: "2022", value: 170782 },
      { period: "2021", value: 152836 },
      { period: "2020", value: 104956 },
      { period: "2019", value: 98392 }
    ],
    operatingIncome: [
      { period: "2023", value: 114301 },
      { period: "2022", value: 119437 },
      { period: "2021", value: 108949 },
      { period: "2020", value: 66288 },
      { period: "2019", value: 63930 }
    ],
    netIncome: [
      { period: "2023", value: 96995 },
      { period: "2022", value: 99803 },
      { period: "2021", value: 94680 },
      { period: "2020", value: 57411 },
      { period: "2019", value: 55256 }
    ]
  };

  const balanceSheet = {
    totalAssets: [
      { period: "2023", value: 352755 },
      { period: "2022", value: 352583 },
      { period: "2021", value: 351002 },
      { period: "2020", value: 323888 },
      { period: "2019", value: 338516 }
    ],
    totalLiabilities: [
      { period: "2023", value: 290437 },
      { period: "2022", value: 302083 },
      { period: "2021", value: 287912 },
      { period: "2020", value: 258549 },
      { period: "2019", value: 248028 }
    ],
    shareholderEquity: [
      { period: "2023", value: 62318 },
      { period: "2022", value: 50500 },
      { period: "2021", value: 63090 },
      { period: "2020", value: 65339 },
      { period: "2019", value: 90488 }
    ],
    totalDebt: [
      { period: "2023", value: 123930 },
      { period: "2022", value: 132281 },
      { period: "2021", value: 124719 },
      { period: "2020", value: 112436 },
      { period: "2019", value: 108047 }
    ]
  };

  const cashFlow = {
    operatingCashFlow: [
      { period: "2023", value: 110543 },
      { period: "2022", value: 122151 },
      { period: "2021", value: 104038 },
      { period: "2020", value: 80674 },
      { period: "2019", value: 69391 }
    ],
    freeCashFlow: [
      { period: "2023", value: 84726 },
      { period: "2022", value: 111443 },
      { period: "2021", value: 92953 },
      { period: "2020", value: 73365 },
      { period: "2019", value: 58896 }
    ],
    capex: [
      { period: "2023", value: -25817 },
      { period: "2022", value: -10708 },
      { period: "2021", value: -11085 },
      { period: "2020", value: -7309 },
      { period: "2019", value: -10495 }
    ]
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