import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface BlockchainService {
  id:             string;
  title:          string;
  slug:           string;
  description:    string;
  network:        string;
  project_type:   string;
  price_from_usd: number | null;
  is_active:      boolean;
  created_at:     string;
}

export interface BlockchainProject {
  id:           string;
  title:        string;
  description:  string;
  network:      string;
  project_type: string;
  status:       string;
  budget_usd:   number | null;
  created_at:   string;
}

export interface InquiryDto {
  name:         string;
  email:        string;
  company?:     string;
  network?:     string;
  project_type?: string;
  description:  string;
  budget_range?: string;
}

@Injectable({ providedIn: 'root' })
export class BlockchainApiService {

  constructor(private api: ApiService) {}

  listServices(): Observable<BlockchainService[]> {
    return this.api.get<BlockchainService[]>('blockchain');
  }

  getService(slug: string): Observable<BlockchainService> {
    return this.api.get<BlockchainService>(`blockchain/${slug}`);
  }

  submitInquiry(dto: InquiryDto): Observable<{ message: string }> {
    return this.api.post<{ message: string }>('blockchain/inquiry', dto);
  }

  myProjects(): Observable<BlockchainProject[]> {
    return this.api.get<BlockchainProject[]>('blockchain/projects');
  }
}