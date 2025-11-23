let pointData = [
  {
    id: 'region-骨干网',
    name: '骨干网',
    color: 0x0000ff,
    type: 'region',
    devices: [
      {
        id: `1`,
        name: `设备1`,
        type: 'device',
      },
      {
        id: `2`,
        name: `设备1`,
        type: 'device',
      },
      {
        id: `3`,
        name: `设备1`,
        type: 'device',
      },
      {
        id: `4`,
        name: `设备1`,
        type: 'device',
      },
      {
        id: `5`,
        name: `设备1`,
        type: 'device',
      },
    ],
    children: [
      {
        id: 'region-沙溪',
        name: '沙溪',
        color: 0xff0000,
        type: 'region',
        devices: [
          {
            id: `1`,
            name: `设备1`,
            type: 'device',
          },
          {
            id: `2`,
            name: `设备1`,
            type: 'device',
          },
          {
            id: `3`,
            name: `设备1`,
            type: 'device',
          },
          {
            id: `4`,
            name: `设备1`,
            type: 'device',
          },
          {
            id: `5`,
            name: `设备1`,
            type: 'device',
          },
        ],
      },
      {
        id: 'region-观达',
        name: '观达',
        color: 0xff8800,
        type: 'region',
        devices: [
          {
            id: `1`,
            name: `设备1`,
            type: 'device',
          },
          {
            id: `2`,
            name: `设备1`,
            type: 'device',
          },
          {
            id: `3`,
            name: `设备1`,
            type: 'device',
          },
          {
            id: `4`,
            name: `设备1`,
            type: 'device',
          },
          {
            id: `5`,
            name: `设备1`,
            type: 'device',
          },
        ],
      },
      {
        id: 'region-科学城',
        name: '科学城',
        color: 0x00ffff,
        type: 'region',
        devices: [
          {
            id: `1`,
            name: `设备1`,
            type: 'device',
          },
          {
            id: `2`,
            name: `设备1`,
            type: 'device',
          },
          {
            id: `3`,
            name: `设备1`,
            type: 'device',
          },
          {
            id: `4`,
            name: `设备1`,
            type: 'device',
          },
          {
            id: `5`,
            name: `设备1`,
            type: 'device',
          },
        ],
      },
      {
        id: 'region-新大厦',
        name: '新大厦',
        color: 0xff00ff,
        type: 'region',
        devices: [
          {
            id: `1`,
            name: `设备1`,
            type: 'device',
          },
          {
            id: `2`,
            name: `设备1`,
            type: 'device',
          },
          {
            id: `3`,
            name: `设备1`,
            type: 'device',
          },
          {
            id: `4`,
            name: `设备1`,
            type: 'device',
          },
          {
            id: `5`,
            name: `设备1`,
            type: 'device',
          },
        ],
      },
      {
        id: 'region-马场',
        name: '马场',
        color: 0xffff00,
        type: 'region',
        devices: [
          {
            id: `1`,
            name: `设备1`,
            type: 'device',
          },
          {
            id: `2`,
            name: `设备1`,
            type: 'device',
          },
          {
            id: `3`,
            name: `设备1`,
            type: 'device',
          },
          {
            id: `4`,
            name: `设备1`,
            type: 'device',
          },
          {
            id: `5`,
            name: `设备1`,
            type: 'device',
          },
        ],
      },
      {
        id: 'region-其他',
        name: '其他',
        color: 0x0088ff,
        type: 'region',
        devices: [
          {
            id: `1`,
            name: `设备1`,
            type: 'device',
          },
          {
            id: `2`,
            name: `设备1`,
            type: 'device',
          },
          {
            id: `3`,
            name: `设备1`,
            type: 'device',
          },
          {
            id: `4`,
            name: `设备1`,
            type: 'device',
          },
          {
            id: `5`,
            name: `设备1`,
            type: 'device',
          },
        ],
      },
    ],
  },
];

const linksData = [
  {
    id: 'link1',
    originId: 'region-骨干网',
    targetId: 'region-沙溪',
    type: 'region',
  },
  {
    id: 'link2',
    originId: 'region-骨干网',
    targetId: 'region-观达',
    type: 'region',
  },
  {
    id: 'link3',
    originId: 'region-骨干网',
    targetId: 'region-马场',
    type: 'region',
  },
  {
    id: 'link4',
    originId: 'region-骨干网',
    targetId: 'region-科学城',
    type: 'region',
  },
  {
    id: 'link5',
    originId: 'region-骨干网',
    targetId: 'region-新大厦',
    type: 'region',
  },
  {
    id: 'link6',
    originId: 'region-骨干网',
    targetId: 'region-其他',
    type: 'region',
  },
  {
    id: 'link7',
    originId: 'region-其他',
    targetId: 'region-新大厦',
    type: 'region',
  },
];

function generateFibonacciSphere(radius, count) {
  const points = [];
  const phi = Math.PI * (3 - Math.sqrt(5)); // 黄金角度

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = phi * i;
    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;
    points.push([x * radius, y * radius, z * radius]);
  }

  // 随机旋转整个球面
  return rotatePointsRandomly(points);
}

function rotatePointsRandomly(points) {
  const angleX = Math.random() * Math.PI * 2;
  const angleY = Math.random() * Math.PI * 2;
  const angleZ = Math.random() * Math.PI * 2;

  return points.map(([x, y, z]) => {
    const cosX = Math.cos(angleX),
      sinX = Math.sin(angleX);
    const y1 = y * cosX - z * sinX;
    const z1 = y * sinX + z * cosX;

    const cosY = Math.cos(angleY),
      sinY = Math.sin(angleY);
    const x2 = x * cosY + z1 * sinY;
    const z2 = -x * sinY + z1 * cosY;

    const cosZ = Math.cos(angleZ),
      sinZ = Math.sin(angleZ);
    const x3 = x2 * cosZ - y1 * sinZ;
    const y3 = x2 * sinZ + y1 * cosZ;

    return [x3, y3, z2];
  });
}

function addPositionsToData(data) {
  data[0].position = [0, 0, 0];

  // 为子节点生成均匀分布的位置
  const childrenCount = data[0].children.length;
  const sphereRadius = 200; // 球体半径
  const positions = generateFibonacciSphere(sphereRadius, childrenCount);

  // 为每个子节点分配位置
  data[0].children.forEach((child, index) => {
    child.position = positions[index];
  });

  return data;
}

export const regions = addPositionsToData(pointData);

export const links = linksData;
