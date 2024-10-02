import pandas as pd
import json
import numpy as np


def map_data(df, map_df, col1, col2, keep_cols):
    mapped = pd.merge(df, map_df, left_on=col1, right_on=col2)
    return mapped[keep_cols]

def main():
    indir = '/Users/nimay/Desktop/exwas_results/'
    outdir = '/Users/nimay/Desktop/all-by-all-browser/src/data/exwas/'
    data = {}
    table_data = {}

    df_raw = pd.read_csv(f"{indir}saige.suggestive.regions.csv")
    df_map = pd.read_table(f"{indir}homo_sapiens_111_b38.txt")
    keep_cols = ['cohort', 'phenotype', 'gene', 'seq_region_start', 'seq_region_end', 'p_value_burden']
    df = map_data(df_raw, df_map, col1='gene', col2='gene_id', keep_cols=keep_cols)

    df['log_p'] = -np.log10(df['p_value_burden'])
    df['avg_pos'] = (df['seq_region_start'] + df['seq_region_end']) / 2

    phenos = df['phenotype'].unique().tolist()
    cohorts = df['cohort'].unique().tolist()

    for coh in cohorts:
        data[coh] = {}
        table_data[coh] = {}
        for pheno in phenos:
            df_coh_pheno = df.query('(cohort == @coh) and (phenotype == @pheno)')
            if (df_coh_pheno.empty):
                continue
            
            table_data[coh][pheno] = df_coh_pheno.to_dict(orient='records')
            data[coh][pheno] = {
                'avg_pos': df_coh_pheno['avg_pos'].tolist(),
                'logp': df_coh_pheno['log_p'].tolist(),
                'pval': df_coh_pheno['p_value_burden'].tolist(),
                'seq_region_start': df_coh_pheno['seq_region_start'].tolist(),
                'seq_region_end': df_coh_pheno['seq_region_end'].tolist(),
                'gene': df_coh_pheno['gene'].tolist()
            }

    with open(f"{outdir}saige_exwas_suggestive.json", 'w') as f:
        json.dump(data, f)
    
    with open(f"{outdir}saige_exwas_suggestive_table.json", 'w') as f:
        json.dump(table_data, f)


if __name__ == '__main__':
    main()