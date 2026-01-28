package fr.daddyornot.universdesames.service;

import fr.daddyornot.universdesames.model.ProductSize;
import fr.daddyornot.universdesames.model.dto.ProductSizeDTO;
import fr.daddyornot.universdesames.repository.ProductSizeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductSizeService {
    private final ProductSizeRepository productSizeRepository;

    public List<ProductSizeDTO> getAllSizes() {
        return productSizeRepository.findAll().stream()
                .map(s -> new ProductSizeDTO(s.getId(), s.getLabel(), s.getDescription()))
                .collect(Collectors.toList());
    }

    public ProductSizeDTO createSize(ProductSizeDTO dto) {
        ProductSize size = new ProductSize();
        size.setLabel(dto.label());
        size.setDescription(dto.description());
        ProductSize saved = productSizeRepository.save(size);
        return new ProductSizeDTO(saved.getId(), saved.getLabel(), saved.getDescription());
    }
    
    public void deleteSize(Long id) {
        productSizeRepository.deleteById(id);
    }
}
