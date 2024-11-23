"use client";
import { useState } from "react";
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
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image as PDFImage,
} from "@react-pdf/renderer";
import dynamic from 'next/dynamic';
const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  { ssr: false }
);


const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
    alignSelf: "center",
  },
  section: {
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
    paddingVertical: 5,
  },
  tableHeader: {
    fontWeight: "bold",
    backgroundColor: "#f2f2f2",
    textAlign: "center",
  },
  column: {
    flex: 1,
    textAlign: "center",
  },
  totalSection: {
    marginTop: 15,
    textAlign: "right",
  },
  bold: {
    fontWeight: "bold",
  },
});

interface InvoiceGeneratorProps {
  type: "invoice" | "estimate" | "quote" | "custom";
  customType?: string;
  logo?: string;
  from: string;
  to: string;
  invnumber: string;
  date: number;
  due: number;
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
}

export default function InvoiceGenerator() {
  const [invoice, setInvoice] = useState<InvoiceGeneratorProps>({
    type: "invoice",
    from: "",
    to: "",
    invnumber: "",
    date: Date.now(),
    due: Date.now() + 1000 * 60 * 60 * 24 * 30,
    items: [
      {
        description: "Item 1",
        price: 100,
        quantity: 1,
      },
    ],
  });
  return (
    <div className="min-h-screen flex flex-col container mx-auto w-11/12 pt-24 items-center">
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
            <input
              type="file"
              id="logo"
              title="Upload your logo"
              className="w-24 h-24 hidden"
              onChange={(e) =>
                setInvoice({
                  ...invoice,
                  logo: e.target.files
                    ? URL.createObjectURL(e.target.files[0])
                    : invoice.logo,
                })
              }
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
                    onClick={() => setInvoice({ ...invoice, logo: undefined })}
                  >
                    Remove Logo
                  </button>
                </div>
              )}
            </div>
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
                      date: date?.getTime() || invoice.date,
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
                      due: date?.getTime() || invoice.due,
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
              htmlFor="note"
              className="text-purple-500 font-semibold text-start"
            >
              Note <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              className="border-none focus-visible:ring-0 p-0 mt-0 font-semibold shadow-none"
              type="text"
              id="note"
              placeholder="Additional Notes"
              value={invoice.note}
              onChange={(e) => setInvoice({ ...invoice, note: e.target.value })}
            />
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

          <button
            className="bg-purple-500 text-white font-semibold p-2 rounded-md w-full shadow-md mt-4"
            onClick={() => console.log(invoice)}
          >
            Generate Invoice
          </button>
        </div>
        <div className="hidden md:block w-full h-screen shadow-md p-4">
          <PDFViewer width="100%" height="100%">
            <Document
              title={
                (invoice.type === "custom"
                  ? invoice.customType
                  : invoice.type) +
                "-" +
                invoice.invnumber
              }
            >
              <Page size="A4" style={styles.page}>
                {/* Logo */}
                {invoice.logo ? (
                  <PDFImage src={invoice.logo} style={styles.logo} />
                ) : null}

                {/* Header */}
                <Text style={styles.header}>
                  {invoice.type === "custom"
                    ? invoice.customType
                    : invoice.type}
                </Text>

                {/* Invoice Details */}
                <View style={styles.section}>
                  <View style={styles.row}>
                    <Text>From: {invoice.from}</Text>
                    <Text>To: {invoice.to}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text>Invoice #{invoice.invnumber}</Text>
                    <Text>
                      Date Created:{" "}
                      {new Date(invoice.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text>
                      Due Date: {new Date(invoice.due).toLocaleDateString()}
                    </Text>
                  </View>
                </View>

                {/* Items Table */}
                <View style={styles.section}>
                  <View style={[styles.tableRow, styles.tableHeader]}>
                    <Text style={styles.column}>Description</Text>
                    <Text style={styles.column}>Price</Text>
                    <Text style={styles.column}>Quantity</Text>
                    <Text style={styles.column}>Note</Text>
                    <Text style={styles.column}>Total</Text>
                  </View>
                  {invoice.items.map((item, index) => (
                    <View style={styles.tableRow} key={index}>
                      <Text style={styles.column}>{item.description}</Text>
                      <Text style={styles.column}>{item.price.toFixed(2)}</Text>
                      <Text style={styles.column}>{item.quantity}</Text>
                      <Text style={styles.column}>{item.note || "-"}</Text>
                      <Text style={styles.column}>
                        {(item.price * item.quantity).toFixed(2)}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Footer Section */}
                <View style={styles.totalSection}>
                  <Text>
                    Subtotal:{" "}
                    {invoice.items
                      .reduce(
                        (acc, item) => acc + item.price * item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </Text>
                  <Text>
                    Tax ({invoice.tax || 0}%):{" "}
                    {(
                      invoice.items.reduce(
                        (acc, item) => acc + item.price * item.quantity,
                        0
                      ) *
                      ((invoice.tax || 0) / 100)
                    ).toFixed(2)}
                  </Text>
                  <Text>
                    Discount ({invoice.discount || 0}%):{" "}
                    {(
                      invoice.items.reduce(
                        (acc, item) => acc + item.price * item.quantity,
                        0
                      ) *
                      ((invoice.discount || 0) / 100)
                    ).toFixed(2)}
                  </Text>
                  <Text>Shipping: {(invoice.shipping ?? 0).toFixed(2)}</Text>
                  <Text style={styles.bold}>
                    Total:{" "}
                    {(
                      invoice.items.reduce(
                        (acc, item) => acc + item.price * item.quantity,
                        0
                      ) *
                        (1 + (invoice.tax || 0) / 100) *
                        (1 - (invoice.discount || 0) / 100) +
                      (invoice.shipping || 0)
                    ).toFixed(2)}
                  </Text>
                </View>

                {/* Additional Notes */}
                {invoice.note && (
                  <View style={styles.section}>
                    <Text>Note:</Text>
                    <Text>{invoice.note}</Text>
                  </View>
                )}
              </Page>
            </Document>
          </PDFViewer>
        </div>
      </div>
    </div>
  );
}
