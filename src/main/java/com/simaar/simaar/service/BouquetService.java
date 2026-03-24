package com.simaar.simaar.service;

import org.springframework.lang.NonNull;
import com.simaar.simaar.dto.BouquetDTO;
import com.simaar.simaar.dto.BouquetOptionDTO;
import com.simaar.simaar.dto.BouquetRequest;
import com.simaar.simaar.model.Bouquet;
import com.simaar.simaar.model.BouquetOption;
import com.simaar.simaar.repository.BouquetOptionRepository;
import com.simaar.simaar.repository.BouquetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BouquetService {

    private final BouquetRepository bouquetRepository;
    private final BouquetOptionRepository bouquetOptionRepository;

    // get all available bouquets (for homepage)
    public List<BouquetDTO> getAllAvailable() {
        return bouquetRepository.findAllAvailable()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // get all bouquets including unavailable (for admin)
    public List<BouquetDTO> getAll() {
        return bouquetRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // get one bouquet by id
    public BouquetDTO getById(Long id) {
        Bouquet bouquet = bouquetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bouquet not found"));
        return toDTO(bouquet);
    }

    // admin creates a new bouquet
    @Transactional
    public BouquetDTO create(BouquetRequest request) {
        Bouquet bouquet = new Bouquet();
        bouquet.setName(request.getName());
        bouquet.setDescription(request.getDescription());
        bouquet.setBasePrice(request.getBasePrice());
        bouquet.setImageUrl(request.getImageUrl());
        bouquet.setIsAvailable(request.getIsAvailable());

        Bouquet saved = bouquetRepository.save(bouquet);

        if (request.getOptions() != null) {
            for (BouquetOptionDTO optionDTO : request.getOptions()) {
                BouquetOption option = new BouquetOption();
                option.setBouquet(saved);
                option.setColor(optionDTO.getColor());
                option.setFlowerCount(optionDTO.getFlowerCount());
                bouquetOptionRepository.save(option);
            }
        }

        Long savedId = saved.getId();
        if (savedId == null) throw new RuntimeException("Failed to save bouquet");
        return toDTO(bouquetRepository.findById(savedId)
                .orElseThrow(() -> new RuntimeException("Bouquet not found")));
    }

    // admin updates an existing bouquet
   @Transactional
public BouquetDTO update(@NonNull Long id, BouquetRequest request) {
    Bouquet bouquet = bouquetRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Bouquet not found"));

    bouquet.setName(request.getName());
    bouquet.setDescription(request.getDescription());
    bouquet.setBasePrice(request.getBasePrice());
    bouquet.setImageUrl(request.getImageUrl());
    bouquet.setIsAvailable(request.getIsAvailable());

    bouquetRepository.save(bouquet);

    if (request.getOptions() != null) {
        bouquetOptionRepository.deleteByBouquetId(id);
        for (BouquetOptionDTO optionDTO : request.getOptions()) {
            BouquetOption option = new BouquetOption();
            option.setBouquet(bouquet);
            option.setColor(optionDTO.getColor());
            option.setFlowerCount(optionDTO.getFlowerCount());
            bouquetOptionRepository.save(option);
        }
    }

    return toDTO(bouquetRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Bouquet not found")));
}

    // admin deletes a bouquet
    @Transactional
public void delete(@NonNull Long id) {
    if (!bouquetRepository.existsById(id)) {
        throw new RuntimeException("Bouquet not found");
    }
    bouquetOptionRepository.deleteByBouquetId(id);
    bouquetRepository.deleteById(id);
}

    // converts Bouquet model to BouquetDTO
    private BouquetDTO toDTO(Bouquet bouquet) {
        BouquetDTO dto = new BouquetDTO();
        dto.setId(bouquet.getId());
        dto.setName(bouquet.getName());
        dto.setDescription(bouquet.getDescription());
        dto.setBasePrice(bouquet.getBasePrice());
        dto.setImageUrl(bouquet.getImageUrl());
        dto.setIsAvailable(bouquet.getIsAvailable());

        Long bouquetId = bouquet.getId();
        if (bouquetId != null) {
            List<BouquetOptionDTO> options = bouquetOptionRepository
                    .findByBouquetId(bouquetId)
                    .stream()
                    .map(this::toOptionDTO)
                    .collect(Collectors.toList());
            dto.setOptions(options);
        }

        return dto;
    }

    // converts BouquetOption model to BouquetOptionDTO
    private BouquetOptionDTO toOptionDTO(BouquetOption option) {
        BouquetOptionDTO dto = new BouquetOptionDTO();
        dto.setId(option.getId());
        dto.setColor(option.getColor());
        dto.setFlowerCount(option.getFlowerCount());
        return dto;
    }
}