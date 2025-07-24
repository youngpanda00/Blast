import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AddressSearchSelect } from "./ui/address-search-select";
import { Input } from "./ui/input";

export const AddressSearchExample: React.FC = () => {
  const [selectedAddress, setSelectedAddress] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);

  const handleAddressSelect = (addressData: any) => {
    setSearchResult(addressData);
    console.log("Address search result:", addressData);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>地址搜索组件示例</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              使用 AddressSearchSelect 组件：
            </label>
            <AddressSearchSelect
              value={selectedAddress}
              onValueChange={setSelectedAddress}
              onAddressSelect={handleAddressSelect}
              placeholder="Enter the property address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              或使用 Input 组件（带 isAddressSearch 属性）：
            </label>
            <Input
              isAddressSearch={true}
              value={selectedAddress}
              onChange={(e) => setSelectedAddress(e.target.value)}
              onAddressSelect={handleAddressSelect}
              placeholder="Enter the property address"
            />
          </div>

          {selectedAddress && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="font-medium text-green-800 mb-2">选中的地址：</h3>
              <p className="text-green-700">{selectedAddress}</p>
            </div>
          )}

          {searchResult && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="font-medium text-blue-800 mb-2">API 返回结果：</h3>
              <pre className="text-sm text-blue-700 whitespace-pre-wrap">
                {JSON.stringify(searchResult, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
