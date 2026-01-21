package fr.daddyornot.universdesames.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import fr.daddyornot.universdesames.model.Order;
import fr.daddyornot.universdesames.model.OrderItem;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class InvoiceService {

    public byte[] generateInvoice(Order order) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, out);
            document.open();

            // Couleurs
            Color primaryColor = new Color(139, 92, 246); // Violet Spirit
            Color lightGray = new Color(245, 245, 245);

            // En-tête
            PdfPTable headerTable = new PdfPTable(2);
            headerTable.setWidthPercentage(100);
            
            // Logo / Nom Entreprise
            PdfPCell companyCell = new PdfPCell();
            companyCell.setBorder(Rectangle.NO_BORDER);
            Font companyFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, primaryColor);
            companyCell.addElement(new Paragraph("L'Univers des Âmes", companyFont));
            companyCell.addElement(new Paragraph("123 Rue de la Paix\n75000 Paris\nSIRET: 123 456 789 00012"));
            headerTable.addCell(companyCell);

            // Titre Facture
            PdfPCell titleCell = new PdfPCell();
            titleCell.setBorder(Rectangle.NO_BORDER);
            titleCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24, Color.DARK_GRAY);
            Paragraph title = new Paragraph("FACTURE", titleFont);
            title.setAlignment(Element.ALIGN_RIGHT);
            titleCell.addElement(title);
            titleCell.addElement(new Paragraph("N° " + order.getInvoiceNumber(), FontFactory.getFont(FontFactory.HELVETICA, 12, Element.ALIGN_RIGHT)));
            titleCell.addElement(new Paragraph("Date : " + order.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")), FontFactory.getFont(FontFactory.HELVETICA, 12, Element.ALIGN_RIGHT)));
            headerTable.addCell(titleCell);

            document.add(headerTable);
            document.add(Chunk.NEWLINE);
            document.add(Chunk.NEWLINE);

            // Infos Client
            PdfPTable clientTable = new PdfPTable(1);
            clientTable.setWidthPercentage(40);
            clientTable.setHorizontalAlignment(Element.ALIGN_RIGHT);
            
            PdfPCell clientHeader = new PdfPCell(new Phrase("Facturé à :", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.WHITE)));
            clientHeader.setBackgroundColor(primaryColor);
            clientHeader.setPadding(5);
            clientHeader.setBorder(Rectangle.NO_BORDER);
            clientTable.addCell(clientHeader);

            PdfPCell clientInfo = new PdfPCell();
            clientInfo.setBorder(Rectangle.BOX);
            clientInfo.setPadding(10);
            clientInfo.addElement(new Paragraph(order.getCustomerName(), FontFactory.getFont(FontFactory.HELVETICA_BOLD)));
            
            // Adresse
            if (order.getBillingAddress() != null) {
                clientInfo.addElement(new Paragraph(order.getBillingAddress()));
                clientInfo.addElement(new Paragraph((order.getBillingPostalCode() != null ? order.getBillingPostalCode() : "") + " " + (order.getBillingCity() != null ? order.getBillingCity() : "")));
                clientInfo.addElement(new Paragraph(order.getBillingCountry() != null ? order.getBillingCountry() : ""));
            }
            clientInfo.addElement(new Paragraph(order.getCustomerEmail()));
            
            clientTable.addCell(clientInfo);
            document.add(clientTable);
            
            document.add(Chunk.NEWLINE);
            document.add(Chunk.NEWLINE);

            // Tableau des articles
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{4, 1, 2, 2});
            table.setHeaderRows(1);

            // En-têtes
            addTableHeader(table, "Désignation", primaryColor);
            addTableHeader(table, "Qté", primaryColor);
            addTableHeader(table, "Prix Unit.", primaryColor);
            addTableHeader(table, "Total", primaryColor);

            // Lignes
            boolean alternate = false;
            for (OrderItem item : order.getItems()) {
                Color bg = alternate ? lightGray : Color.WHITE;
                addCell(table, item.getProductName(), bg);
                addCell(table, String.valueOf(item.getQuantity()), bg);
                addCell(table, String.format("%.2f €", item.getPriceAtPurchase()), bg);
                addCell(table, String.format("%.2f €", item.getPriceAtPurchase() * item.getQuantity()), bg);
                alternate = !alternate;
            }

            document.add(table);
            document.add(Chunk.NEWLINE);

            // Total
            PdfPTable totalTable = new PdfPTable(2);
            totalTable.setWidthPercentage(40);
            totalTable.setHorizontalAlignment(Element.ALIGN_RIGHT);
            totalTable.setWidths(new float[]{1, 1});

            addTotalRow(totalTable, "Total HT", String.format("%.2f €", order.getTotalAmount() * 0.8)); // Exemple TVA 20%
            addTotalRow(totalTable, "TVA (20%)", String.format("%.2f €", order.getTotalAmount() * 0.2));
            
            PdfPCell totalLabel = new PdfPCell(new Phrase("Total TTC", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.WHITE)));
            totalLabel.setBackgroundColor(primaryColor);
            totalLabel.setPadding(8);
            totalTable.addCell(totalLabel);

            PdfPCell totalValue = new PdfPCell(new Phrase(String.format("%.2f €", order.getTotalAmount()), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.WHITE)));
            totalValue.setBackgroundColor(primaryColor);
            totalValue.setHorizontalAlignment(Element.ALIGN_RIGHT);
            totalValue.setPadding(8);
            totalTable.addCell(totalValue);

            document.add(totalTable);

            // Footer
            document.add(Chunk.NEWLINE);
            document.add(Chunk.NEWLINE);
            Paragraph footer = new Paragraph("Merci de votre confiance !", FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 10, Color.GRAY));
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération de la facture", e);
        }
    }

    private void addTableHeader(PdfPTable table, String headerTitle, Color bg) {
        PdfPCell header = new PdfPCell();
        header.setBackgroundColor(bg);
        header.setPhrase(new Phrase(headerTitle, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.WHITE)));
        header.setPadding(8);
        header.setHorizontalAlignment(Element.ALIGN_CENTER);
        header.setBorder(Rectangle.NO_BORDER);
        table.addCell(header);
    }

    private void addCell(PdfPTable table, String text, Color bg) {
        PdfPCell cell = new PdfPCell(new Phrase(text));
        cell.setBackgroundColor(bg);
        cell.setPadding(8);
        cell.setBorder(Rectangle.BOTTOM);
        cell.setBorderColor(Color.LIGHT_GRAY);
        table.addCell(cell);
    }

    private void addTotalRow(PdfPTable table, String label, String value) {
        PdfPCell c1 = new PdfPCell(new Phrase(label));
        c1.setBorder(Rectangle.NO_BORDER);
        c1.setPadding(5);
        table.addCell(c1);

        PdfPCell c2 = new PdfPCell(new Phrase(value));
        c2.setBorder(Rectangle.NO_BORDER);
        c2.setHorizontalAlignment(Element.ALIGN_RIGHT);
        c2.setPadding(5);
        table.addCell(c2);
    }
}
