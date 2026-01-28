package fr.daddyornot.universdesames.service;

import fr.daddyornot.universdesames.model.Stone;
import fr.daddyornot.universdesames.model.dto.StoneDTO;
import fr.daddyornot.universdesames.repository.StoneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StoneService {
    private final StoneRepository stoneRepository;

    public List<StoneDTO> getAllStones() {
        return stoneRepository.findAll().stream()
                .map(s -> new StoneDTO(s.getId(), s.getName(), s.getDescription()))
                .collect(Collectors.toList());
    }

    public StoneDTO createStone(StoneDTO dto) {
        Stone stone = new Stone();
        stone.setName(dto.name());
        stone.setDescription(dto.description());
        Stone saved = stoneRepository.save(stone);
        return new StoneDTO(saved.getId(), saved.getName(), saved.getDescription());
    }
    
    public void deleteStone(Long id) {
        stoneRepository.deleteById(id);
    }
}
