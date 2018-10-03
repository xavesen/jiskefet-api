import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Run } from './run.entity';
import { Detector } from './detector.entity';

@Entity('detectors_in_run')
export class DetectorsInRun {

    @ManyToOne(type => Run, run => run.detectorsInRun, {
        eager: true,
    })
    @JoinColumn({ name: 'run_number' })
    @PrimaryColumn({ type: 'bigint' })
    run: Run;

    @ManyToOne(type => Detector, detector => detector.detectorsInRun, {
        eager: true,
    })
    @JoinColumn({ name: 'detector_id' })
    @PrimaryColumn({ type: 'bigint' })
    detector: Detector;

    @Column({
        name: 'run_quality',
        type: 'enum',
        enum: ['test'],
    })
    runQuality: 'test';
}