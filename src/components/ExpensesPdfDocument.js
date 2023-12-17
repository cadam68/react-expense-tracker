import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 30,
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "#333333",
  },
  header: {
    fontSize: 12,
    marginBottom: 10,
    textAlign: "center",
    color: "grey",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderColor: "#b6b6b6",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tableColHeader: {
    width: "25%",
    borderStyle: "solid",
    borderColor: "#b6b6b6",
    borderBottomColor: "#000",
    borderWidth: 1,
    backgroundColor: "#f3f3f3",
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    textAlign: "left",
    padding: 5,
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderColor: "#b6b6b6",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    textAlign: "left",
    padding: 5,
  },
  tableCellHeader: {
    fontSize: 12,
  },
  tableCell: {
    fontSize: 10,
    color: "#555555",
  },
});

// Create a component for the PDF content
const ExpensesPdfDocument = ({ expenses }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Expense Report</Text>
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Date</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Category</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Description</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Amount</Text>
          </View>
        </View>
        {/* Table Rows */}
        {expenses.map((expense, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{format(expense.date, "dd-MM-yyyy")}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{expense.category}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{expense.description}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{expense.amount}</Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default ExpensesPdfDocument;
