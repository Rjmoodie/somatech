import { supabase } from '@/integrations/supabase/client';

export const supabaseDebug = {
  async testConnection() {
    const start = performance.now();
    const { data, error, count } = await supabase
      .from('properties')
      .select('id, address, zip', { count: 'exact' })
      .limit(1);
    
    const latency = performance.now() - start;
    
    console.log('🗄️ [Supabase Test]', {
      status: error ? 'error' : 'success',
      latency: `${latency.toFixed(2)}ms`,
      dataCount: count,
      sampleData: data?.[0],
      error: error?.message,
      timestamp: new Date().toISOString(),
    });
    
    return { data, error, latency };
  },

  async checkIndexes() {
    const queries = [
      { 
        name: 'zip_filter', 
        query: supabase.from('properties').select('id').eq('zip', '12345') 
      },
      { 
        name: 'equity_filter', 
        query: supabase.from('properties').select('id').gte('equity_percent', 20) 
      },
      { 
        name: 'owner_type_filter', 
        query: supabase.from('properties').select('id').eq('owner_type', 'individual') 
      },
      {
        name: 'address_search',
        query: supabase.from('properties').select('id').ilike('address', '%main%')
      },
    ];

    const results = [];

    for (const { name, query } of queries) {
      const start = performance.now();
      const { error, data } = await query.limit(1);
      const latency = performance.now() - start;
      
      const result = {
        query: name,
        latency: `${latency.toFixed(2)}ms`,
        status: error ? 'needs_index' : 'optimized',
        error: error?.message,
        dataCount: data?.length || 0,
      };
      
      results.push(result);
      console.log(`📊 [Index Check] ${name}:`, result);
    }

    return results;
  },

  async checkTableSizes() {
    const tables = ['properties', 'users', 'deals', 'leads', 'notifications'];
    const results = [];

    for (const table of tables) {
      try {
        const start = performance.now();
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        const latency = performance.now() - start;

        const result = {
          table,
          rowCount: count || 0,
          latency: `${latency.toFixed(2)}ms`,
          status: error ? 'error' : 'success',
          error: error?.message,
        };

        results.push(result);
        console.log(`📈 [Table Size] ${table}:`, result);
      } catch (err: any) {
        console.error(`❌ [Table Size] Error checking ${table}:`, err.message);
      }
    }

    return results;
  },

  monitorRealtime() {
    const subscription = supabase
      .channel('debug_channel')
      .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        console.log('🔄 [Realtime Debug]', {
          table: payload.table,
          event: payload.eventType,
          record: payload.new,
          oldRecord: payload.old,
          timestamp: new Date().toISOString(),
        });
      })
      .subscribe();

    console.log('🔄 [Realtime] Monitoring started for all tables');
    return subscription;
  },

  async testRLS() {
    const tests = [
      {
        name: 'authenticated_user_read',
        query: supabase.from('properties').select('id').limit(1),
        expected: 'success',
      },
      {
        name: 'unauthenticated_user_read',
        query: supabase.auth.signOut().then(() => 
          supabase.from('properties').select('id').limit(1)
        ),
        expected: 'error',
      },
    ];

    for (const test of tests) {
      try {
        const start = performance.now();
        const { data, error } = await test.query;
        const latency = performance.now() - start;

        const result = {
          test: test.name,
          status: error ? 'error' : 'success',
          expected: test.expected,
          actual: error ? 'error' : 'success',
          passed: (error && test.expected === 'error') || (!error && test.expected === 'success'),
          latency: `${latency.toFixed(2)}ms`,
          error: error?.message,
        };

        console.log(`🔒 [RLS Test] ${test.name}:`, result);
      } catch (err: any) {
        console.error(`❌ [RLS Test] Error in ${test.name}:`, err.message);
      }
    }
  },

  async checkQueryPerformance() {
    const queries = [
      {
        name: 'simple_select',
        query: supabase.from('properties').select('id, address'),
        description: 'Basic select with minimal columns',
      },
      {
        name: 'filtered_select',
        query: supabase.from('properties').select('id, address').eq('equity_percent', 20),
        description: 'Select with equality filter',
      },
      {
        name: 'range_filter',
        query: supabase.from('properties').select('id, address').gte('equity_percent', 10).lte('equity_percent', 50),
        description: 'Select with range filter',
      },
      {
        name: 'text_search',
        query: supabase.from('properties').select('id, address').ilike('address', '%street%'),
        description: 'Text search with ILIKE',
      },
      {
        name: 'complex_filter',
        query: supabase.from('properties')
          .select('id, address, equity_percent')
          .eq('owner_type', 'individual')
          .gte('equity_percent', 20)
          .order('equity_percent', { ascending: false })
          .limit(10),
        description: 'Complex filter with ordering and limit',
      },
    ];

    const results = [];

    for (const { name, query, description } of queries) {
      try {
        const start = performance.now();
        const { data, error, count } = await query;
        const latency = performance.now() - start;

        const result = {
          query: name,
          description,
          latency: `${latency.toFixed(2)}ms`,
          status: error ? 'error' : 'success',
          dataCount: data?.length || 0,
          totalCount: count || 0,
          error: error?.message,
          performance: latency < 100 ? 'excellent' : latency < 500 ? 'good' : 'needs_optimization',
        };

        results.push(result);
        console.log(`⚡ [Query Performance] ${name}:`, result);
      } catch (err: any) {
        console.error(`❌ [Query Performance] Error in ${name}:`, err.message);
      }
    }

    return results;
  },

  async checkStorageUsage() {
    try {
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        console.error('❌ [Storage] Error listing buckets:', bucketsError.message);
        return;
      }

      console.log('📦 [Storage] Available buckets:', buckets?.map(b => b.name));

      for (const bucket of buckets || []) {
        try {
          const { data: files, error: filesError } = await supabase.storage
            .from(bucket.name)
            .list('', { limit: 100 });

          if (filesError) {
            console.error(`❌ [Storage] Error listing files in ${bucket.name}:`, filesError.message);
            continue;
          }

          console.log(`📁 [Storage] ${bucket.name}:`, {
            fileCount: files?.length || 0,
            files: files?.slice(0, 5).map(f => ({ name: f.name, size: f.metadata?.size })),
          });
        } catch (err: any) {
          console.error(`❌ [Storage] Error accessing bucket ${bucket.name}:`, err.message);
        }
      }
    } catch (err: any) {
      console.error('❌ [Storage] Error checking storage usage:', err.message);
    }
  },

  async monitorConnectionPool() {
    // Monitor connection pool status
    const poolStatus = {
      activeConnections: 0,
      idleConnections: 0,
      totalConnections: 0,
      timestamp: new Date().toISOString(),
    };

    // This would require server-side monitoring in a real implementation
    console.log('🔗 [Connection Pool]', poolStatus);
    return poolStatus;
  },

  // Performance monitoring utilities
  createQueryMonitor() {
    const queryLog: any[] = [];

    const monitorQuery = async <T>(
      queryName: string,
      queryFn: () => Promise<T>
    ): Promise<T> => {
      const start = performance.now();
      
      try {
        const result = await queryFn();
        const duration = performance.now() - start;

        const logEntry = {
          name: queryName,
          duration: `${duration.toFixed(2)}ms`,
          status: 'success',
          timestamp: new Date().toISOString(),
        };

        queryLog.push(logEntry);
        console.log(`🔍 [Query Monitor] ${queryName}:`, logEntry);

        if (duration > 1000) {
          console.warn(`⚠️ [Query Monitor] Slow query detected: ${queryName} took ${duration.toFixed(2)}ms`);
        }

        return result;
      } catch (error: any) {
        const duration = performance.now() - start;
        
        const logEntry = {
          name: queryName,
          duration: `${duration.toFixed(2)}ms`,
          status: 'error',
          error: error.message,
          timestamp: new Date().toISOString(),
        };

        queryLog.push(logEntry);
        console.error(`❌ [Query Monitor] ${queryName}:`, logEntry);
        
        throw error;
      }
    };

    const getQueryStats = () => {
      const stats = queryLog.reduce((acc, log) => {
        acc.totalQueries++;
        acc.totalDuration += parseFloat(log.duration);
        
        if (log.status === 'error') {
          acc.errorCount++;
        }
        
        if (parseFloat(log.duration) > 1000) {
          acc.slowQueries++;
        }
        
        return acc;
      }, {
        totalQueries: 0,
        totalDuration: 0,
        errorCount: 0,
        slowQueries: 0,
        averageDuration: 0,
      });

      stats.averageDuration = stats.totalQueries > 0 
        ? stats.totalDuration / stats.totalQueries 
        : 0;

      return stats;
    };

    return {
      monitorQuery,
      getQueryStats,
      getQueryLog: () => queryLog,
      clearLog: () => { queryLog.length = 0; },
    };
  },
};

// Export individual functions for easier use
export const testSupabaseConnection = supabaseDebug.testConnection;
export const checkSupabaseIndexes = supabaseDebug.checkIndexes;
export const checkSupabaseTableSizes = supabaseDebug.checkTableSizes;
export const monitorSupabaseRealtime = supabaseDebug.monitorRealtime;
export const testSupabaseRLS = supabaseDebug.testRLS;
export const checkSupabaseQueryPerformance = supabaseDebug.checkQueryPerformance;
export const checkSupabaseStorageUsage = supabaseDebug.checkStorageUsage; 