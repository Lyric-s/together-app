export type Mission = {
  id: string;
  title: string;
  association_name: string;
  city?: string;
  category: string;
  categoryColor: string;
  date: Date;
  image: string;
  number_max_volunteers: number;
  number_of_volunteers: number;
  favorite?: boolean;
};