export const other_hosts_data= data => {
  let ndata = [];
  data.forEach((value) =>{
    let nline = {};
    nline['nickname'] = value['nickname'];
    nline['InstanceName'] = value['fields']['InstanceName'];
    nline['OSType'] = value['fields']['OSType'];
    nline['ZoneId'] = value['fields']['ZoneId'];
    nline['PublicIpAddress_'] = value['fields']['PublicIpAddress'];
    nline['Status'] = value['fields']['Status'];
    nline['InstanceNetworkType'] = value['fields']['InstanceNetworkType'];
    nline['PrivateIpAddress'] = value['fields']['PrivateIpAddress'];
    nline['InternetMaxBandwidthOut'] = value['fields']['InternetMaxBandwidthOut'];
    nline['Cpu'] = value['fields']['Cpu'];
    nline['Memory'] = value['fields']['Memory'];
    nline['InstanceChargeType'] = value['fields']['InstanceChargeType'];
    ndata.push(nline)
  });
  return ndata
};

export const slb_data= data => {
  let ndata = [];
  data.forEach((value) =>{
    let nline = {};
    nline['InstanceId'] = value['LoadBalancerId'];
    nline['InstanceName'] = value['InstanceName'];
    nline['OSType'] = 'SLB';
    nline['InstanceNetworkType'] = value['NetworkType'];
    nline['Address'] = value['Address'];
    if (value['PayType'] === 'PayOnDemand'){
      nline['InstanceChargeType'] = '按量计费'
    }else {
      nline['InstanceChargeType'] = '包年包月'
    }
    nline['ZoneId'] = value['MasterZoneId'];
    nline['Status'] = value['LoadBalancerStatus'];
    nline['user_type']= value['user_type'];
    ndata.push(nline)
  });
  return ndata
};


