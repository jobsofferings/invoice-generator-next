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
}

interface InvoiceDocumentProps {
  invoice: InvoiceData;
}

const InvoiceDocument: React.FC<InvoiceDocumentProps> = ({ invoice }) => (
  <Document
    title={
      (invoice.type === "custom" ? invoice.customType : invoice.type) +
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
            .reduce((acc, item) => acc + item.price * item.quantity, 0)
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
);

export default InvoiceDocument;
