package fr.daddyornot.universdesames.service;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import fr.daddyornot.universdesames.model.Order;
import fr.daddyornot.universdesames.model.OrderItem;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class InvoiceService {

    public byte[] generateInvoice(Order order) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        // Marges plus larges pour un look plus "premium"
        Document document = new Document(PageSize.A4, 36, 36, 54, 54);

        try {
            PdfWriter.getInstance(document, baos);
            document.open();

            // Couleurs modernes
            Color accentColor = new Color(31, 41, 55); // Gris très foncé/Bleu nuit
            Color secondaryText = new Color(107, 114, 128); // Gris doux
            Color rowAlternate = new Color(249, 250, 251); // Gris ultra léger pour le zebra

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, accentColor);
            Font subTitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, accentColor);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.DARK_GRAY);
            Font smallFont = FontFactory.getFont(FontFactory.HELVETICA, 9, secondaryText);

            // --- EN-TÊTE : Design Minimaliste ---
            PdfPTable header = new PdfPTable(2);
            header.setWidthPercentage(100);

            // Gauche : Logo et Nom
            PdfPCell leftHeader = new PdfPCell();
            leftHeader.setBorder(Rectangle.NO_BORDER);
            leftHeader.addElement(new Phrase("VOTRE NOM", subTitleFont));
            leftHeader.addElement(new Phrase("Auto-entrepreneur", smallFont));
            header.addCell(leftHeader);

            // Droite : Titre Facture
            PdfPCell rightHeader = new PdfPCell();
            rightHeader.setBorder(Rectangle.NO_BORDER);
            rightHeader.setHorizontalAlignment(Element.ALIGN_RIGHT);
            Paragraph p = new Paragraph("FACTURE", titleFont);
            p.setAlignment(Element.ALIGN_RIGHT);
            rightHeader.addElement(p);
            header.addCell(rightHeader);

            document.add(header);

            // Ligne de séparation subtile
            lineSeparator(document, secondaryText);

            // --- INFOS CLIENTS (Layout moderne en colonnes) ---
            PdfPTable clientTable = new PdfPTable(2);
            clientTable.setWidthPercentage(100);
            clientTable.setSpacingBefore(20);

            // Infos Facture
            PdfPCell infoCell = new PdfPCell();
            infoCell.setBorder(Rectangle.NO_BORDER);
            infoCell.addElement(new Phrase("NUMÉRO", smallFont));
            infoCell.addElement(new Phrase(order.getInvoiceNumber(), subTitleFont));
            infoCell.addElement(new Phrase("\nDATE", smallFont));
            infoCell.addElement(new Phrase(order.getCreatedAt().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")), subTitleFont));
            clientTable.addCell(infoCell);

            // Adresse Client
            PdfPCell addrCell = new PdfPCell();
            addrCell.setBorder(Rectangle.NO_BORDER);
            addrCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            Paragraph addr = new Paragraph();
            addr.setAlignment(Element.ALIGN_RIGHT);
            addr.add(new Phrase("FACTURÉ À\n", smallFont));
            addr.add(new Phrase(order.getCustomerName() + "\n", subTitleFont));
            addr.add(new Phrase(order.getBillingAddress() + "\n" + order.getBillingCity(), normalFont));
            addrCell.addElement(addr);
            clientTable.addCell(addrCell);

            document.add(clientTable);

            // --- TABLEAU DES ARTICLES (Look épuré) ---
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setSpacingBefore(30);
            table.setWidths(new float[]{ 4, 1, 2, 2 });

            // Headers sans fond coloré, juste une bordure basse
            String[] headers = { "Description", "Qté", "Prix Unitaire", "Montant" };
            for (String h : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(h.toUpperCase(), smallFont));
                cell.setBorder(Rectangle.BOTTOM);
                cell.setBorderColor(Color.LIGHT_GRAY);
                cell.setPaddingBottom(8);
                if (!h.equals("Description")) cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                table.addCell(cell);
            }

            // Items
            int count = 0;
            for (OrderItem item : order.getItems()) {
                Color bg = (count % 2 == 0) ? Color.WHITE : rowAlternate;
                table.addCell(createItemCell(item.getProductName(), bg, normalFont, Element.ALIGN_LEFT));
                table.addCell(createItemCell(String.valueOf(item.getQuantity()), bg, normalFont, Element.ALIGN_RIGHT));
                table.addCell(createItemCell(String.format("%.2f €", item.getPriceAtPurchase()), bg, normalFont, Element.ALIGN_RIGHT));
                table.addCell(createItemCell(String.format("%.2f €", item.getQuantity() * item.getPriceAtPurchase()), bg, subTitleFont, Element.ALIGN_RIGHT));
                count++;
            }
            document.add(table);

            // --- TOTAL ---
            PdfPTable totalTable = new PdfPTable(2);
            totalTable.setWidthPercentage(100);
            totalTable.setSpacingBefore(20);

            PdfPCell empty = new PdfPCell();
            empty.setBorder(Rectangle.NO_BORDER);
            totalTable.addCell(empty);

            PdfPCell totalCell = new PdfPCell();
            totalCell.setBorder(Rectangle.TOP);
            totalCell.setBorderWidth(1f);
            totalCell.setPaddingTop(10);
            Paragraph totP = new Paragraph();
            totP.setAlignment(Element.ALIGN_RIGHT);
            totP.add(new Phrase("TOTAL NET : ", normalFont));
            totP.add(new Phrase(String.format("%.2f €", order.getTotalAmount()), titleFont));
            totalCell.addElement(totP);
            totalTable.addCell(totalCell);

            document.add(totalTable);

            // --- FOOTER FIXE ---
            Paragraph footer = new Paragraph("TVA non applicable, art. 293 B du CGI", smallFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            footer.setSpacingBefore(100);
            document.add(footer);

            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return baos.toByteArray();
    }

    // Méthode helper pour des cellules d'articles propres
    private PdfPCell createItemCell(String text, Color bg, Font font, int align) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBackgroundColor(bg);
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setPadding(10);
        cell.setHorizontalAlignment(align);
        return cell;
    }

    private void lineSeparator(Document doc, Color color) throws DocumentException {
        PdfPTable line = new PdfPTable(1);
        line.setWidthPercentage(100);
        PdfPCell cell = new PdfPCell();
        cell.setBorder(Rectangle.BOTTOM);
        cell.setBorderColor(color);
        cell.setFixedHeight(10f);
        line.addCell(cell);
        doc.add(line);
    }
}
