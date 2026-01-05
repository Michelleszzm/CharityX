package com.charity.x.common.utils;

import com.charity.x.dto.vo.CharityDonationRecordVo;
import com.itextpdf.io.font.PdfEncodings;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.canvas.draw.SolidLine;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.OutputStream;
import java.math.RoundingMode;
import java.net.URL;
import java.time.format.DateTimeFormatter;

@Slf4j
public class PdfGeneratorUtil {

    private static final String ZERO_WIDTH_SPACE = "\u200B";

    private static final String FONT_PATH = new ClassPathResource("font/NotoSansSC-Regular.ttf").getPath();

    /**
     * Create font
     *
     * @return
     */
    private static PdfFont getFont() {
        try {
            return PdfFontFactory.createFont(
                    FONT_PATH,
                    PdfEncodings.IDENTITY_H,
                    PdfFontFactory.EmbeddingStrategy.FORCE_EMBEDDED,
                    true
            );
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static void generateDonationReceipt(OutputStream os,
                                               CharityDonationRecordVo recordVo,
                                               String organizationName,
                                               String organizationLogoImage) throws Exception {

        PdfWriter writer = new PdfWriter(os);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc);

        document.setFont(getFont());
        document.setFontSize(10);
        document.add(new Paragraph("DONATION RECEIPT")
                .setFontSize(18).setBold()
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(10));

        document.add(new LineSeparator(new SolidLine()).setMarginBottom(15));

        // Adjust column width ratio, give more space to long text (wallet address, transaction hash)
        Table table = new Table(UnitValue.createPercentArray(new float[]{25, 75}))
                .setWidth(UnitValue.createPercentValue(100));

        addRow(table, "Donation Date:", recordVo.getPayTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        addRow(table, "Amount:", "$" + recordVo.getAmount().setScale(2, RoundingMode.HALF_UP));
        addRow(table, "Donor Wallet Address:", formatLongText(recordVo.getDonorWallet()));
        addRow(table, "Transaction Hash:", formatLongText(recordVo.getTxHash()));

        table.setMarginBottom(20);

        addRow(table, "Organization:", organizationName);
        addRow(table, "EIN:", recordVo.getEin() == null ? "" : recordVo.getEin());

        table.setMarginBottom(20);
        document.add(table);

        document.add(new Paragraph("We confirm that no goods or services were provided in exchange for this contribution."));
        document.add(new Paragraph("Thank you for your support!").setMarginBottom(20));

        if (organizationLogoImage != null && !organizationLogoImage.isEmpty()) {
            Image img = organizationLogoImage.startsWith("http") ?
                    getImageByUrl(organizationLogoImage):
                    new Image(ImageDataFactory.create(organizationLogoImage));
            if (img != null) {
                img.setHeight(70);
                document.add(img);
            }
        }

        document.close();
    }

    private static Image getImageByUrl(String organizationLogoImage) {
        if (organizationLogoImage != null && !organizationLogoImage.isEmpty()) {
            try (var in = new URL(organizationLogoImage).openStream()) {
                byte[] logoBytes = in.readAllBytes();
                if (logoBytes.length > 16) {
                    return new Image(ImageDataFactory.create(logoBytes));
                } else {
                    log.error("Logo bytes too small, skip logo");
                }
            } catch (Exception e) {
                log.error("Load logo failed, skip logo: " + organizationLogoImage);
            }
        }
        return null;
    }


    private static void addRow(Table table, String label, String value) {

        table.addCell(new Cell()
                .add(new Paragraph(label).setBold())
                .setBorder(null)
                .setPadding(5)
        );

        Cell valueCell = new Cell()
                .add(new Paragraph(value))
                .setBorder(null)
                .setPadding(5);

        // 🔥Key: Allow iText to automatically break lines and split Cell
        valueCell.setKeepTogether(false);
        valueCell.setMinWidth(0);

        table.addCell(valueCell);
    }

    /**
     * Add zero-width break hints for consecutive long strings (wallet, hash)
     * Insert zero-width space every 4 characters to help iText break lines at appropriate positions
     */
    private static String formatLongText(String text) {
        if (text == null || text.isEmpty()) {
            return "";
        }
        return text.replaceAll("(?<=.{4})", ZERO_WIDTH_SPACE);
    }
}
