"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ImageIcon } from "lucide-react";
import InvoiceDocument from "@/components/invoice-document";
import dynamic from "next/dynamic";
import { getUserInfoList, getCompanyLogoList, getMarksWithCompany, getInformationWithCompany } from "@/lib/utils";
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false }
);

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);



interface InvoiceGeneratorProps {
  type: "invoice" | "estimate" | "quote" | "custom";
  customType?: string;
  logo?: string;
  logoPosition?: "left" | "center" | "right";
  from: string;
  to: string;
  invnumber: string;
  date: string;
  due: string;
  items: {
    description: string;
    price: number;
    quantity: number;
    note?: string;
  }[];
  note?: string;
  tax?: number;
  discount?: number;
  shipping?: number;
  additionalInfo?: string;
  signature?: string;
  signatureText?: string;
  marks?: string;
  currency?: string;
}

export default function InvoiceGenerator() {
  const [isClient, setIsClient] = useState(false);
  const userInfoList = getUserInfoList();
  const companyLogoList = getCompanyLogoList();
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const [invoice, setInvoice] = useState<InvoiceGeneratorProps>({
    type: "invoice",
    logoPosition: "left",
    from: "",
    to: "",
    invnumber: "",
    date: new Date().toISOString(),
    due: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    currency: "USD",
    items: [
      {
        description: "Item 1",
        price: 100,
        quantity: 1,
      },
    ],
  });
  
  const handleUserSelect = (userId: string) => {
    const selectedUser = userInfoList.find(user => user.name === userId);
    if (selectedUser) {
      setInvoice({
        ...invoice,
        signatureText: selectedUser.name,
        signature: selectedUser.sign_png
      });
    }
  };
  
  const handleCompanySelect = (companyName: string) => {
    const selectedCompany = companyLogoList.find(company => company.name === companyName);
    if (selectedCompany) {
      setSelectedCompany(companyName);
      
      setInvoice({
        ...invoice,
        logo: selectedCompany.logo,
        marks: getMarksWithCompany(companyName),
        additionalInfo: getInformationWithCompany(companyName)
      });
    }
  };
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setInvoice({
        ...invoice,
        logo: URL.createObjectURL(e.target.files[0])
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col container mx-auto w-full md:w-11/12 pt-24 items-center">
      <div className="w-full flex flex-col items-center bg-muted/20 p-4 px-2 rounded-md shadow-md">
        <div className="text-primary font-black text-xl w-full text-center uppercase">
          Free Invoice Generator
        </div>
        <div className="text-center text-muted-foreground w-11/12 font-medium">
          Create an invoice with our free invoice generator in seconds.
        </div>
      </div>

      <div className="flex flex-row justify-center md:justify-between w-full bg-muted/20 mt-4 p-4 rounded-md">
        <div className="rounded-md w-full p-4 flex flex-col gap-6 justify-center align-middle items-center">
          <div className="grid w-full items-center gap-1.5">
            <Select
              onValueChange={(value) =>
                setInvoice({
                  ...invoice,
                  type: value as "invoice" | "estimate" | "quote" | "custom",
                })
              }
            >
              <SelectTrigger className="w-full bg-muted/20 capitalize py-8 font-semibold text-lg">
                <div className="flex flex-col gap-1">
                  <Label
                    htmlFor="customType"
                    className="text-purple-500 font-semibold text-start"
                  >
                    Type
                  </Label>
                  <SelectValue placeholder="invoice" />
                </div>
              </SelectTrigger>
              <SelectContent className="font-semibold text-lg">
                <SelectItem value="invoice">Invoice</SelectItem>
                <SelectItem value="estimate">Estimate</SelectItem>
                <SelectItem value="quote">Quote</SelectItem>
                <SelectItem value="custom">
                  Custom{" "}
                  <span className="text-purple-500">
                    - Define Your Own Type
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {invoice.type == "custom" && (
            <div className="grid w-full items-center bg-muted/20 p-2 rounded-md border-2">
              <Label
                htmlFor="customType"
                className="text-purple-500 font-semibold text-start"
              >
                Custom Type
              </Label>
              <Input
                className="border-none focus-visible:ring-0 p-0 mt-0 font-semibold"
                type="text"
                id="customType"
                placeholder="Write your custom invoice type here."
                onChange={(e) =>
                  setInvoice({ ...invoice, customType: e.target.value })
                }
              />
            </div>
          )}

          {/* logo */}
          <div className="grid w-full items-center bg-muted/20 p-2 rounded-md border-2">
            <Label
              htmlFor="logo"
              className="text-purple-500 font-semibold text-start"
            >
              Logo <span className="text-muted-foreground">(optional)</span>
            </Label>
            
            <div className="mb-4">
              <Label
                htmlFor="companySelect"
                className="text-purple-500 font-semibold text-start"
              >
                Company <span className="text-muted-foreground">(预设公司)</span>
              </Label>
              <Select
                value={selectedCompany || ""}
                onValueChange={handleCompanySelect}
              >
                <SelectTrigger className="w-full bg-muted/20 py-2 font-semibold">
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {companyLogoList.map((company) => (
                    <SelectItem key={company.name} value={company.name}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-center text-muted-foreground mb-2">或者上传自定义 Logo</div>
            
            <input
              type="file"
              id="logo"
              title="Upload your logo"
              className="w-24 h-24 hidden"
              onChange={handleLogoUpload}
            />
            <div className="w-full h-48 flex justify-center align-middle items-center">
              {!invoice.logo && (
                <div
                  className="w-24 h-24 flex flex-col items-center justify-center cursor-pointer font-bold gap-2"
                  onClick={() => document.getElementById("logo")?.click()}
                >
                  <ImageIcon />
                  <div>Upload File</div>
                </div>
              )}
              {invoice.logo && (
                <div className="p-2 w-full h-full bg-muted/40 flex flex-col items-center justify-between cursor-pointer font-bold gap-2">
                  <Image
                    src={invoice.logo}
                    alt="Logo"
                    width={128}
                    height={128}
                    className="object-contain cursor-pointer w-3/4 h-3/4"
                    onClick={() => document.getElementById("logo")?.click()}
                  />

                  <button
                    className="bg-muted/20 font-semibold p-2 rounded-md w-full text-muted-foreground shadow-md"
                    onClick={() => {
                      setInvoice({ ...invoice, logo: undefined });
                      setSelectedCompany(null);
                    }}
                  >
                    Remove Logo
                  </button>
                </div>
              )}
            </div>
            
            {invoice.logo && (
              <div className="mt-2">
                <Label className="text-purple-500 font-semibold">Logo Position</Label>
                <div className="flex gap-2 mt-1">
                  <button
                    className={`p-2 rounded-md flex-1 ${
                      invoice.logoPosition === "left" 
                        ? "bg-purple-500 text-white" 
                        : "bg-muted/20"
                    }`}
                    onClick={() => setInvoice({ ...invoice, logoPosition: "left" })}
                  >
                    Left
                  </button>
                  <button
                    className={`p-2 rounded-md flex-1 ${
                      invoice.logoPosition === "center" 
                        ? "bg-purple-500 text-white" 
                        : "bg-muted/20"
                    }`}
                    onClick={() => setInvoice({ ...invoice, logoPosition: "center" })}
                  >
                    Center
                  </button>
                  <button
                    className={`p-2 rounded-md flex-1 ${
                      invoice.logoPosition === "right" 
                        ? "bg-purple-500 text-white" 
                        : "bg-muted/20"
                    }`}
                    onClick={() => setInvoice({ ...invoice, logoPosition: "right" })}
                  >
                    Right
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="grid w-full items-center bg-muted/20 p-2 rounded-md border-2">
            <Label
              htmlFor="from"
              className="text-purple-500 font-semibold text-start"
            >
              From
            </Label>
            <Input
              className="border-none focus-visible:ring-0 p-0 mt-0 font-semibold shadow-none"
              type="text"
              id="from"
              placeholder="Your Company, Full Name, etc."
              value={invoice.from}
              onChange={(e) => setInvoice({ ...invoice, from: e.target.value })}
            />
          </div>

          <div className="grid w-full items-center bg-muted/20 p-2 rounded-md border-2">
            <Label
              htmlFor="to"
              className="text-purple-500 font-semibold text-start"
            >
              To
            </Label>
            <Input
              className="border-none focus-visible:ring-0 p-0 mt-0 font-semibold shadow-none"
              type="text"
              id="to"
              placeholder="Full Name, Email, Phone Number, etc."
              value={invoice.to}
              onChange={(e) => setInvoice({ ...invoice, to: e.target.value })}
            />
          </div>

          <div className="grid w-full items-center bg-muted/20 p-2 rounded-md border-2">
            <Label
              htmlFor="invnumber"
              className="text-purple-500 font-semibold text-start"
            >
              Invoice #
            </Label>
            <Input
              className="border-none focus-visible:ring-0 p-0 mt-0 font-semibold shadow-none"
              type="text"
              id="invnumber"
              placeholder="Invoice Number"
              value={invoice.invnumber}
              onChange={(e) =>
                setInvoice({ ...invoice, invnumber: e.target.value })
              }
            />
          </div>

          <div className="grid w-full items-center bg-muted/20 p-2 rounded-md border-2">
            <Label
              htmlFor="date"
              className="text-purple-500 font-semibold text-start"
            >
              Date Created
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <div className="font-semibold">
                  {new Date(invoice.date).toLocaleDateString()}
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-full">
                <Calendar
                  mode="single"
                  selected={new Date(invoice.date)}
                  onSelect={(date: Date | undefined) =>
                    setInvoice({
                      ...invoice,
                      date: date?.toISOString() || invoice.date,
                    })
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid w-full items-center bg-muted/20 p-2 rounded-md border-2">
            <Label
              htmlFor="due"
              className="text-purple-500 font-semibold text-start"
            >
              Due Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <div className="font-semibold">
                  {new Date(invoice.due).toLocaleDateString()}
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-full">
                <Calendar
                  mode="single"
                  selected={new Date(invoice.due)}
                  onSelect={(date: Date | undefined) =>
                    setInvoice({
                      ...invoice,
                      due: date?.toISOString() || invoice.due,
                    })
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid w-full items-center bg-muted/20 p-4 rounded-md">
            <Label
              htmlFor="items"
              className="text-purple-500 font-semibold text-center text-lg"
            >
              Items
            </Label>
            {invoice.items.map((item, index) => (
              <div
                key={index}
                className="grid gap-1.5 p-2 shadow-md border mt-4"
              >
                <Label
                  htmlFor={`item-${index}`}
                  className="text-purple-500 font-semibold text-center p-2"
                >
                  Item {index + 1}
                </Label>
                <div className="grid w-full items-center p-2 rounded-md border-2">
                  <Label
                    htmlFor={`description-${index}`}
                    className="text-purple-500 font-semibold text-start"
                  >
                    Description
                  </Label>
                  <Input
                    className="border-none focus-visible:ring-0 p-0 mt-0 font-semibold shadow-none"
                    type="text"
                    id={`description-${index}`}
                    placeholder="Item Description"
                    value={item.description}
                    onChange={(e) =>
                      setInvoice({
                        ...invoice,
                        items: invoice.items.map((i, iindex) =>
                          iindex == index
                            ? { ...i, description: e.target.value }
                            : i
                        ),
                      })
                    }
                  />
                </div>
                <div className="grid w-full items-center p-2 rounded-md border-2">
                  <Label
                    htmlFor={`price-${index}`}
                    className="text-purple-500 font-semibold text-start"
                  >
                    Price
                  </Label>
                  <Input
                    className="border-none focus-visible:ring-0 p-0 mt-0 font-semibold shadow-none"
                    type="number"
                    id={`price-${index}`}
                    placeholder="Item Price"
                    value={item.price}
                    onChange={(e) =>
                      setInvoice({
                        ...invoice,
                        items: invoice.items.map((i, iindex) =>
                          iindex == index
                            ? { ...i, price: parseFloat(e.target.value) }
                            : i
                        ),
                      })
                    }
                  />
                </div>
                <div className="grid w-full items-center p-2 rounded-md border-2">
                  <Label
                    htmlFor={`quantity-${index}`}
                    className="text-purple-500 font-semibold text-start"
                  >
                    Quantity
                  </Label>
                  <Input
                    className="border-none focus-visible:ring-0 p-0 mt-0 font-semibold shadow-none"
                    type="number"
                    id={`quantity-${index}`}
                    placeholder="Item Quantity"
                    value={item.quantity}
                    onChange={(e) =>
                      setInvoice({
                        ...invoice,
                        items: invoice.items.map((i, iindex) =>
                          iindex == index
                            ? { ...i, quantity: parseFloat(e.target.value) }
                            : i
                        ),
                      })
                    }
                  />
                </div>

                <div className="grid w-full items-center p-2 rounded-md border-2">
                  <Label
                    htmlFor={`note-${index}`}
                    className="text-purple-500 font-semibold text-start"
                  >
                    Note{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    className="border-none focus-visible:ring-0 p-0 mt-0 font-semibold shadow-none"
                    type="text"
                    id={`note-${index}`}
                    placeholder="Add a note to the item"
                    value={item.note}
                    onChange={(e) =>
                      setInvoice({
                        ...invoice,
                        items: invoice.items.map((i, iindex) =>
                          iindex == index ? { ...i, note: e.target.value } : i
                        ),
                      })
                    }
                  />
                </div>

                <button
                  className="bg-red-500/20 border border-red-500 text-red-500 font-semibold p-2 rounded-md w-full shadow-md mt-62"
                  onClick={() =>
                    setInvoice({
                      ...invoice,
                      items: invoice.items.filter(
                        (_, iindex) => iindex != index
                      ),
                    })
                  }
                >
                  Remove Item
                </button>
              </div>
            ))}

            <button
              className="bg-purple-500 text-white font-semibold p-2 rounded-md w-full shadow-md mt-6"
              onClick={() =>
                setInvoice({
                  ...invoice,
                  items: [
                    ...invoice.items,
                    {
                      description: `Item ${invoice.items.length + 1}`,
                      price: 0,
                      quantity: 1,
                    },
                  ],
                })
              }
            >
              Add Item
            </button>
          </div>

          <div className="grid w-full items-center bg-muted/20 p-2 rounded-md border-2">
            <Label
              htmlFor="additionalInfo"
              className="text-purple-500 font-semibold text-start"
            >
              Additional Information <span className="text-muted-foreground">(右上角信息)</span>
            </Label>
            <textarea
              className="border-none focus-visible:ring-0 p-0 mt-0 font-semibold shadow-none min-h-24 resize-y"
              id="additionalInfo"
              placeholder="公司地址、联系方式等信息"
              value={invoice.additionalInfo}
              onChange={(e) => setInvoice({ ...invoice, additionalInfo: e.target.value })}
            />
            {selectedCompany && (
              <button
                className="bg-purple-500 text-white font-semibold p-2 rounded-md mt-2 shadow-md"
                onClick={() => setInvoice({ 
                  ...invoice, 
                  additionalInfo: getInformationWithCompany(selectedCompany) 
                })}
              >
                重置为公司默认信息
              </button>
            )}
          </div>

          <div className="grid w-full items-center bg-muted/20 p-2 rounded-md border-2">
            <Label
              htmlFor="marks"
              className="text-purple-500 font-semibold text-start"
            >
              Marks <span className="text-muted-foreground">(左下角标记，包含备注)</span>
            </Label>
            <textarea
              className="border-none focus-visible:ring-0 p-0 mt-0 font-semibold shadow-none min-h-24 resize-y"
              id="marks"
              placeholder="备注、银行信息等（支持多行）"
              value={invoice.marks}
              onChange={(e) => setInvoice({ ...invoice, marks: e.target.value })}
            />
            {selectedCompany && (
              <button
                className="bg-purple-500 text-white font-semibold p-2 rounded-md mt-2 shadow-md"
                onClick={() => setInvoice({ 
                  ...invoice, 
                  marks: getMarksWithCompany(selectedCompany) 
                })}
              >
                重置为公司默认标记
              </button>
            )}
          </div>

          <div className="grid w-full items-center bg-muted/20 p-2 rounded-md border-2">
            <Label
              htmlFor="signature"
              className="text-purple-500 font-semibold text-start"
            >
              Signature/Stamp <span className="text-muted-foreground">(右下角签名/盖章)</span>
            </Label>
            <input
              type="file"
              id="signature"
              title="Upload signature or stamp"
              className="w-24 h-24 hidden"
              onChange={(e) =>
                setInvoice({
                  ...invoice,
                  signature: e.target.files
                    ? URL.createObjectURL(e.target.files[0])
                    : invoice.signature,
                })
              }
            />
            <div className="w-full h-32 flex justify-center align-middle items-center">
              {!invoice.signature && (
                <div
                  className="w-24 h-24 flex flex-col items-center justify-center cursor-pointer font-bold gap-2"
                  onClick={() => document.getElementById("signature")?.click()}
                >
                  <ImageIcon />
                  <div>Upload Signature</div>
                </div>
              )}
              {invoice.signature && (
                <div className="p-2 w-full h-full bg-muted/40 flex flex-col items-center justify-between cursor-pointer font-bold gap-2">
                  <Image
                    src={invoice.signature}
                    alt="Signature"
                    width={128}
                    height={128}
                    className="object-contain cursor-pointer w-3/4 h-3/4"
                    onClick={() => document.getElementById("signature")?.click()}
                  />

                  <button
                    className="bg-muted/20 font-semibold p-2 rounded-md w-full text-muted-foreground shadow-md"
                    onClick={() => setInvoice({ ...invoice, signature: undefined })}
                  >
                    Remove Signature
                  </button>
                </div>
              )}
            </div>
            
            <div className="mt-2">
              <Label
                htmlFor="signatureText"
                className="text-purple-500 font-semibold text-start"
              >
                Signature User <span className="text-muted-foreground">(签名人)</span>
              </Label>
              <Select
                value={invoice.signatureText}
                onValueChange={handleUserSelect}
              >
                <SelectTrigger className="w-full bg-muted/20 py-2 font-semibold">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {userInfoList.map((user) => (
                    <SelectItem key={user.name} value={user.name}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid w-full items-center bg-muted/20 p-2 rounded-md border-2">
            <Label
              htmlFor="currency"
              className="text-purple-500 font-semibold text-start"
            >
              Currency
            </Label>
            <Select
              value={invoice.currency}
              onValueChange={(value) => setInvoice({ ...invoice, currency: value })}
            >
              <SelectTrigger className="w-full bg-muted/20 py-2 font-semibold">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="CNY">CNY (¥)</SelectItem>
                <SelectItem value="JPY">JPY (¥)</SelectItem>
                <SelectItem value="CAD">CAD ($)</SelectItem>
                <SelectItem value="AUD">AUD ($)</SelectItem>
                <SelectItem value="INR">INR (₹)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Subtotal */}
          <div className="w-full flex justify-between p-2 font-bold text-lg bg-muted/20 border rounded-md">
            <div>Subtotal</div>
            <div className="text-purple-500">
              {invoice.items.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
              )}
            </div>
          </div>

          <div className="flex flex-col bg-muted/20 p-2 rounded-md shadow-md border w-full">
            <Label className="text-purple-500 font-semibold text-center mt-2">
              Additional Variables
            </Label>

            <div className="flex justify-between gap-2 items-center align-middle mt-4 text-sm">
              {invoice.tax == undefined ? (
                <button
                  type="button"
                  className="bg-purple-500 text-white font-semibold p-2 rounded-md w-full shadow-md"
                  onClick={() => setInvoice({ ...invoice, tax: 10 })}
                >
                  + Tax
                </button>
              ) : (
                <button
                  type="button"
                  className="bg-red-500/20 border border-red-500 text-red-500 font-semibold p-2 rounded-md w-full shadow-md"
                  onClick={() => setInvoice({ ...invoice, tax: undefined })}
                >
                  - Tax
                </button>
              )}

              {invoice.discount == undefined ? (
                <button
                  type="button"
                  className="bg-purple-500 text-white font-semibold p-2 rounded-md w-full shadow-md"
                  onClick={() => setInvoice({ ...invoice, discount: 10 })}
                >
                  + Discount
                </button>
              ) : (
                <button
                  type="button"
                  className="bg-red-500/20 border border-red-500 text-red-500 font-semibold p-2 rounded-md w-full shadow-md"
                  onClick={() =>
                    setInvoice({ ...invoice, discount: undefined })
                  }
                >
                  - Discount
                </button>
              )}

              {invoice.shipping == undefined ? (
                <button
                  type="button"
                  className="bg-purple-500 text-white font-semibold p-2 rounded-md w-full shadow-md"
                  onClick={() => setInvoice({ ...invoice, shipping: 10 })}
                >
                  + Shipping
                </button>
              ) : (
                <button
                  type="button"
                  className="bg-red-500/20 border border-red-500 text-red-500 font-semibold p-2 rounded-md w-full shadow-md"
                  onClick={() =>
                    setInvoice({ ...invoice, shipping: undefined })
                  }
                >
                  - Shipping
                </button>
              )}
            </div>

            {invoice.tax != undefined && (
              <div className="grid w-full items-center bg-muted/20 p-2 rounded-md border-2 mt-4">
                <Label htmlFor="tax" className="text-purple-500 font-semibold">
                  Tax <span className="text-muted-foreground">(%)</span>
                </Label>
                <Input
                  className="border-none focus-visible:ring-0 p-0 mt-0 font-semibold shadow-none"
                  type="number"
                  id="tax"
                  value={invoice.tax}
                  onChange={(e) =>
                    setInvoice({ ...invoice, tax: parseFloat(e.target.value) })
                  }
                />
              </div>
            )}

            {invoice.discount != undefined && (
              <div className="grid w-full items-center bg-muted/20 p-2 rounded-md border-2 mt-4">
                <Label
                  htmlFor="discount"
                  className="text-purple-500 font-semibold"
                >
                  Discount <span className="text-muted-foreground">(%)</span>
                </Label>
                <Input
                  className="border-none focus-visible:ring-0 p-0 mt-0 font-semibold shadow-none"
                  type="number"
                  id="discount"
                  value={invoice.discount}
                  onChange={(e) =>
                    setInvoice({
                      ...invoice,
                      discount: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
            )}

            {invoice.shipping != undefined && (
              <div className="grid w-full items-center bg-muted/20 p-2 rounded-md border-2 mt-4">
                <Label
                  htmlFor="shipping"
                  className="text-purple-500 font-semibold"
                >
                  Shipping
                </Label>
                <Input
                  className="border-none focus-visible:ring-0 p-0 mt-0 font-semibold shadow-none"
                  type="number"
                  id="shipping"
                  value={invoice.shipping}
                  onChange={(e) =>
                    setInvoice({
                      ...invoice,
                      shipping: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
            )}
          </div>

          <div className="w-full flex justify-between p-2 font-bold text-lg bg-muted/20 border rounded-md">
            <div>Total</div>
            <div className="text-purple-500">
              {(
                invoice.items.reduce(
                  (acc, item) => acc + item.price * item.quantity,
                  0
                ) *
                  (1 + (invoice.tax || 0) / 100) *
                  (1 - (invoice.discount || 0) / 100) +
                (invoice.shipping || 0)
              ).toFixed(2)}
            </div>
          </div>

          {isClient ? (
            <PDFDownloadLink
              className="bg-purple-500 text-white font-semibold p-2 rounded-md w-full shadow-md mt-4 text-center"
              document={<InvoiceDocument invoice={invoice} />}
              fileName={
                (invoice.type === "custom" ? invoice.customType : invoice.type) +
                "-" +
                invoice.invnumber +
                ".pdf"
              }
            >
              {({ loading }) => (loading ? '正在准备文档...' : '生成发票')}
            </PDFDownloadLink>
          ) : (
            <button
              className="bg-purple-500 text-white font-semibold p-2 rounded-md w-full shadow-md mt-4 text-center opacity-50 cursor-not-allowed"
              disabled
            >
              正在加载...
            </button>
          )}
        </div>
        <div className="hidden md:block w-full h-screen shadow-md p-4">
          {isClient ? (
            <PDFViewer width="100%" height="100%">
              <InvoiceDocument invoice={invoice} />
            </PDFViewer>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <p className="text-gray-500">正在加载预览...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
