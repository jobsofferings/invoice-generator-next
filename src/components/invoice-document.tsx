import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image as PDFImage,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
    position: "relative",
  },
  header: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
  },
  logoLeft: {
    width: 100,
    height: 100,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  logoCenter: {
    width: 100,
    height: 100,
    marginBottom: 10,
    alignSelf: "center",
  },
  logoRight: {
    width: 100,
    height: 100,
    marginBottom: 10,
    alignSelf: "flex-end",
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
  additionalInfo: {
    position: "absolute",
    top: 30,
    right: 30,
    maxWidth: 180,
    fontSize: 10,
    textAlign: "right",
  },
  marksSection: {
    position: "absolute",
    bottom: 80,
    left: 30,
    maxWidth: 300,
    fontSize: 10,
  },
  signatureSection: {
    position: "absolute",
    bottom: 80,
    right: 30,
    maxWidth: 150,
    textAlign: "center",
  },
  signatureImage: {
    width: 100,
    height: 50,
    marginBottom: 5,
    alignSelf: "center",
  },
  signatureText: {
    fontSize: 10,
    textAlign: "center",
  },
});

interface InvoiceItem {
  description: string;
  price: number;
  quantity: number;
  note?: string;
}

interface InvoiceData {
  type: string;
  customType?: string;
  logo?: string;
  logoPosition?: "left" | "center" | "right";
  from: string;
  to: string;
  invnumber: string;
  date: string;
  due: string;
  items: InvoiceItem[];
  tax?: number;
  discount?: number;
  shipping?: number;
  note?: string;
  additionalInfo?: string;
  signature?: string;
  signatureText?: string;
  marks?: string;
  currency?: string;
}

interface InvoiceDocumentProps {
  invoice: InvoiceData;
}

const InvoiceDocument: React.FC<InvoiceDocumentProps> = ({ invoice }) => {
  // 设置默认货币单位
  const currency = invoice.currency || "USD";
  
  // 根据 logoPosition 选择对应的样式
  const getLogoStyle = () => {
    switch (invoice.logoPosition) {
      case "center":
        return styles.logoCenter;
      case "right":
        return styles.logoRight;
      default:
        return styles.logoLeft;
    }
  };
  
  // 将多行文本转换为数组
  const splitTextToLines = (text?: string) => {
    return text ? text.split('\n').filter(line => line.trim() !== '') : [];
  };
  
  const additionalInfoLines = splitTextToLines(invoice.additionalInfo);
  
  // 合并 note 和 marks
  const combinedMarks = invoice.marks || '';
  const notePrefix = invoice.note ? `Note:\n${invoice.note}` : '';
  const finalMarks = notePrefix ? (combinedMarks ? `${notePrefix}\n\n${combinedMarks}` : notePrefix) : combinedMarks;
  const marksLines = splitTextToLines(finalMarks);
  
  return (
    <Document
      title={
        (invoice.type === "custom" ? invoice.customType : invoice.type) +
        "-" +
        invoice.invnumber
      }
    >
      <Page size="A4" style={styles.page}>
        {/* 右上角附加信息 */}
        {invoice.additionalInfo && (
          <View style={styles.additionalInfo}>
            {additionalInfoLines.map((line, index) => (
              <Text key={`info-${index}`}>{line}</Text>
            ))}
          </View>
        )}
        
        {/* Logo */}
        {invoice.logo ? (
          <PDFImage src={invoice.logo} style={getLogoStyle()} />
        ) : null}

        {/* Header */}
        <Text style={styles.header}>
          {invoice.type === "custom" ? invoice.customType : invoice.type}
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
              Date Created: {new Date(invoice.date).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.row}>
            <Text>Due Date: {new Date(invoice.due).toLocaleDateString()}</Text>
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
              <Text style={styles.column}>
                {currency} {item.price.toFixed(2)}
              </Text>
              <Text style={styles.column}>{item.quantity}</Text>
              <Text style={styles.column}>{item.note || "-"}</Text>
              <Text style={styles.column}>
                {currency} {(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Footer Section */}
        <View style={styles.totalSection}>
          <Text>
            Subtotal: {currency}{" "}
            {invoice.items
              .reduce((acc, item) => acc + item.price * item.quantity, 0)
              .toFixed(2)}
          </Text>
          {invoice.tax !== undefined && (
            <Text>
              Tax ({invoice.tax || 0}%): {currency}{" "}
              {(
                invoice.items.reduce(
                  (acc, item) => acc + item.price * item.quantity,
                  0
                ) *
                ((invoice.tax || 0) / 100)
              ).toFixed(2)}
            </Text>
          )}
          {invoice.discount !== undefined && (
            <Text>
              Discount ({invoice.discount || 0}%): {currency}{" "}
              {(
                invoice.items.reduce(
                  (acc, item) => acc + item.price * item.quantity,
                  0
                ) *
                ((invoice.discount || 0) / 100)
              ).toFixed(2)}
            </Text>
          )}
          {invoice.shipping !== undefined && (
            <Text>Shipping: {currency} {(invoice.shipping ?? 0).toFixed(2)}</Text>
          )}
          <Text style={styles.bold}>
            Total: {currency}{" "}
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

        {/* 左下角标记（合并了 Note 和 Marks） */}
        {finalMarks && (
          <View style={styles.marksSection}>
            {marksLines.map((line, index) => (
              <Text key={`mark-${index}`}>{line}</Text>
            ))}
          </View>
        )}
        
        {/* 右下角签名/盖章 */}
        {(invoice.signature || invoice.signatureText) && (
          <View style={styles.signatureSection}>
            {invoice.signature && (
              <PDFImage src={invoice.signature} style={styles.signatureImage} />
            )}
            {/* {invoice.signatureText && (
              <Text style={styles.signatureText}>{invoice.signatureText}</Text>
            )} */}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default InvoiceDocument;
