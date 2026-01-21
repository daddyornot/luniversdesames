package fr.daddyornot.universdesames.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.FreeBusyRequest;
import com.google.api.services.calendar.model.FreeBusyRequestItem;
import com.google.api.services.calendar.model.FreeBusyResponse;
import com.google.api.services.calendar.model.TimePeriod;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class GoogleCalendarService {

    private static final String APPLICATION_NAME = "Univers des Ames";
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();

    @Value("${google.calendar.id}")
    private String calendarId;

    @Value("${google.credentials.path}")
    private String credentialsPath;

    private Calendar getCalendarService() throws GeneralSecurityException, IOException {
        final NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
        
        GoogleCredential credential = GoogleCredential.fromStream(new FileInputStream(credentialsPath))
                .createScoped(Collections.singleton("https://www.googleapis.com/auth/calendar.readonly"));

        return new Calendar.Builder(HTTP_TRANSPORT, JSON_FACTORY, credential)
                .setApplicationName(APPLICATION_NAME)
                .build();
    }

    public List<String> getAvailableSlots(LocalDateTime start, LocalDateTime end) {
        try {
            Calendar service = getCalendarService();

            FreeBusyRequest request = new FreeBusyRequest();
            request.setTimeMin(new DateTime(start.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()));
            request.setTimeMax(new DateTime(end.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()));
            request.setItems(Collections.singletonList(new FreeBusyRequestItem().setId(calendarId)));

            FreeBusyResponse response = service.freebusy().query(request).execute();
            List<TimePeriod> busyPeriods = response.getCalendars().get(calendarId).getBusy();

            return calculateFreeSlots(start, end, busyPeriods);

        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    private List<String> calculateFreeSlots(LocalDateTime start, LocalDateTime end, List<TimePeriod> busyPeriods) {
        List<String> freeSlots = new ArrayList<>();
        LocalDateTime currentSlot = start;

        // On définit des créneaux de 1h
        while (currentSlot.plusHours(1).isBefore(end) || currentSlot.plusHours(1).isEqual(end)) {
            boolean isBusy = false;
            long slotStart = currentSlot.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
            long slotEnd = currentSlot.plusHours(1).atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();

            if (busyPeriods != null) {
                for (TimePeriod busy : busyPeriods) {
                    long busyStart = busy.getStart().getValue();
                    long busyEnd = busy.getEnd().getValue();

                    // Si le créneau chevauche une période occupée
                    if (slotStart < busyEnd && slotEnd > busyStart) {
                        isBusy = true;
                        break;
                    }
                }
            }

            if (!isBusy) {
                // Format ISO 8601 pour le frontend
                freeSlots.add(currentSlot.atZone(ZoneId.systemDefault()).format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
            }

            currentSlot = currentSlot.plusHours(1);
        }

        return freeSlots;
    }
}
