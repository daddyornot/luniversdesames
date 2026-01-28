package fr.daddyornot.universdesames.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ref_stones")
@Getter
@Setter
@NoArgsConstructor
public class Stone {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    @Column(length = 1000) // Description plus longue pour les vertus
    private String description;
}
