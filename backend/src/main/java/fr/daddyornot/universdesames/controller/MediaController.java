package fr.daddyornot.universdesames.controller;

import fr.daddyornot.universdesames.service.MediaService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
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
    @Operation(operationId = "uploadMedia", summary = "Upload un fichier vers le storage", responses = {
            @ApiResponse(responseCode = "200", description = "Fichier uploadé avec succès",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Map.class))),
            @ApiResponse(responseCode = "403", description = "Accès refusé", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "500", description = "Erreur lors de l'upload", content = @Content(mediaType = "application/json"))
    })
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        String url = mediaService.uploadFile(file);
        return ResponseEntity.ok(Map.of("url", url));
    }

    @DeleteMapping
    @Secured("ROLE_ADMIN")
    @Operation(operationId = "deleteFileByUrl", summary = "Supprimer un fichier", responses = {
            @ApiResponse(responseCode = "200", description = "Fichier supprimé"),
            @ApiResponse(responseCode = "403", description = "Accès refusé", content = @Content(mediaType = "application/json"))
    })
    public ResponseEntity<Void> deleteFile(@RequestParam("url") String url) {
        mediaService.deleteFile(url);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    @Secured("ROLE_ADMIN")
    @Operation(operationId = "getAllFiles", summary = "Lister les fichiers", responses = {
            @ApiResponse(responseCode = "200", description = "Liste des fichiers",
                    content = @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = String.class)))),
            @ApiResponse(responseCode = "403", description = "Accès refusé", content = @Content(mediaType = "application/json"))
    })
    public ResponseEntity<List<String>> listFiles() {
        return ResponseEntity.ok(mediaService.listFiles());
    }
}
