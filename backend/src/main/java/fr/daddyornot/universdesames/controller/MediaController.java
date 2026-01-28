package fr.daddyornot.universdesames.controller;

import fr.daddyornot.universdesames.service.MediaService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Secured("ROLE_ADMIN")
    @Operation(operationId = "uploadMedia", summary = "Upload un fichier vers le storage")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        String url = mediaService.uploadFile(file);
        return ResponseEntity.ok(Map.of("url", url));
    }

    @DeleteMapping
    @Secured("ROLE_ADMIN")
    @Operation(operationId = "deleteFileByUrl")
    public ResponseEntity<Void> deleteFile(@RequestParam("url") String url) {
        mediaService.deleteFile(url);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    @Secured("ROLE_ADMIN")
    @Operation(operationId = "getAllFiles")
    public ResponseEntity<List<String>> listFiles() {
        return ResponseEntity.ok(mediaService.listFiles());
    }
}
